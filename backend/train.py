import pandas as pd
import numpy as np
import requests
import joblib
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.impute import KNNImputer
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import seaborn as sns
from sklearn.neighbors import KNeighborsRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.decomposition import PCA
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor



# Cleaning the dataset

df = pd.read_csv('amazon_ac_dataset.csv')

df.drop(columns=['prime', 'page_number', 'reviews_count'], inplace=True)

# remove ac remote inventory from AC dataset
df = df[~df['title'].str.contains('remote', case=False, na=False)]

# convert the date object to date 
df['date'] = pd.to_datetime(df['date'])

# 1. CLEAN DISCOUNT_PERCENT (Convert 25% off to 25.0
df['discount_percent'] = pd.to_numeric(
    df['discount_percent'].str.extract(r'(\d+)')[0],
    errors='coerce'
)

print(df['discount_percent'])

df['discount_percent'] = np.where(
    df['discount_percent'] > 35,
    df['discount_percent'] - 30,
    df['discount_percent']
)

print("after subtracting 15")
print(df['discount_percent'])

# 2. CLEAN rating
df['rating'] = pd.to_numeric(
    df['rating'].str.extract(r'(\d+\.?\d*)')[0],
    errors='coerce'
)

# Keep NaN as actual NaN
df['bought_last_month'] = (
    df['bought_last_month']
    .replace({pd.NA: np.nan})
)

def convert_bought(x):
    if isinstance(x, str):
        x = x.replace('+','')
        if 'K' in x:
            return float(x.replace('K','')) * 1000
    return x

df['bought_last_month'] = df['bought_last_month'].str.extract(
    r'(\d+(?:\.\d+)?[Kk]?\+)'
)[0].apply(convert_bought)

df['bought_last_month'] = pd.to_numeric(
    df['bought_last_month'],
    errors='coerce'
)

# If bought last month is NAN, means purchase is 0
df['bought_last_month'] = df['bought_last_month'].fillna(0)

df['original_price'] = (
    df['original_price']
    .astype(str)
    .str.replace('₹', '', regex=False)
    .str.replace(',', '', regex=False)
)

df['original_price'] = pd.to_numeric(
    df['original_price'],
    errors='coerce'
)

binary_cols = ['inverter', 'wifi_enabled']
mapping = {'Yes': 1, 'No': 0}
for col in binary_cols:
    df[col] = df[col].map(mapping)

# df['month'] = df['date'].dt.month
# df['year'] = df['date'].dt.year


# Drop rows with prices NAN
# Price is critical buisness criteria
df = df.dropna(subset=['price'])


# Keep the first occurence in case of duplicate rows
df = df.drop_duplicates(keep='first')

# sns.distplot(df['bought_last_month'])

# df.shape
# df.head(10)

# # df['discount_percent'].describe()
# # # plt.boxplot(df['discount_percent'])

# # df[df['discount_percent'] == 100][
# #     ['brand','title','original_price','discount_percent']
# # ]

# # df[df['discount_percent'] > 60][
# #     ['brand','title','original_price','discount_percent']
# # ].head(20)

# # df[['price','original_price','discount_percent']].corr()

# # plt.scatter(df['price'], df['discount_percent'])

# # df['bought_last_month'].skew()
# ==========================
# FEATURES & TARGET
# ==========================

X = df.drop(columns=['price', 'title', 'discount_percent', 'original_price', 'date'])
y = df[['discount_percent', 'original_price']]


def energy(num):
    if num == 1:
        #Poor
        return 0
    elif num > 1 and num < 4:
        #Good
        return 1
    else:
        #Excellent
        return 2


X['energy_efficient'] = X['star_rating'].apply(energy)

X['smart'] = ((X['wifi_enabled'] == 1) & (X['inverter'] == 1)).astype(int)


# ==========================
# COLUMN GROUPS
# ==========================

numeric_cols = [
    'rating',
    'bought_last_month',
    'inverter',
    'wifi_enabled',
    'smart',
    'energy_efficient',
    'tonnage',
    'star_rating'
]

categorical_cols = [
    'brand',
    'ac_type'
]

# =========================
# NUMERIC PIPELINE
# =========================

numeric_pipeline = make_pipeline(

    # Step 1 : Missing Values
    SimpleImputer(strategy='mean'),

    # Step 2 : Scaling
    StandardScaler()

)


numeric_data = numeric_pipeline.fit_transform(X[numeric_cols])


categorical_pipeline = make_pipeline(

    # Step 1 : Missing Values
    SimpleImputer(strategy='most_frequent'),

    # Step 2 : Encoding
    OneHotEncoder(handle_unknown='ignore')

)

preprocessor = ColumnTransformer(transformers=[('num_pipeline',numeric_pipeline,numeric_cols),('cat_pipeline',categorical_pipeline,categorical_cols)])

# model_pipeline = make_pipeline(
#     preprocessor,
#     LinearRegression()
# )


# model_pipeline = make_pipeline(
#     preprocessor,
#     RandomForestRegressor(
#         n_estimators=300,
#         max_depth=10,
#         random_state=42
#     )
# )


xgb_model = MultiOutputRegressor(
    XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        subsample=1.0,
        colsample_bytree=0.8,
        random_state=42
    )
)

model_pipeline = make_pipeline(
    preprocessor,
    xgb_model
)


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model_pipeline.fit(X_train, y_train)

y_pred = model_pipeline.predict(X_test)

# param_grid = {
#     'multioutputregressor__estimator__n_estimators': [100, 200, 300],
#     'multioutputregressor__estimator__max_depth': [3, 4, 5],
#     'multioutputregressor__estimator__learning_rate': [0.01, 0.05, 0.1],
#     'multioutputregressor__estimator__subsample': [0.8, 1.0]
# }

# grid_search = GridSearchCV(
#     estimator=model_pipeline,
#     param_grid=param_grid,
#     cv=5,
#     scoring='r2',
#     n_jobs=-1
# )

# grid_search.fit(X_train, y_train)

# print("Best Parameters:")
# print(grid_search.best_params_)

# print("Best Score:")
# print(grid_search.best_score_)

print("\nDiscount R2 Score:")
r2_discount = r2_score(y_test['discount_percent'], y_pred[:, 0])
print(r2_discount)

print("\nPrice R2 Score:")
r2_price = r2_score(y_test['original_price'], y_pred[:, 1])
print(r2_price)

price_mae = mean_absolute_error(
    y_test['discount_percent'],
    y_pred[:, 0]
)

discount_mae = mean_absolute_error(
    y_test['original_price'],
    y_pred[:, 1]
)

print("\nDsicount MAE:", price_mae)
print("\nOrignal Price MAE:", discount_mae)


print("\nMSE")
print(mean_squared_error(y_test, y_pred))

print("\nRMSE")
print(np.sqrt(mean_squared_error(y_test, y_pred)))

joblib.dump(model_pipeline, "ac_price_model.pkl")