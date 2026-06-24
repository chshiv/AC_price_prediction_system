from pydantic import BaseModel, field_validator


class ACRequest(BaseModel):

    brand: str
    ac_type: str
    tonnage: float
    star_rating: int
    inverter: int
    wifi_enabled: int
    rating: float
    bought_last_month: int


    @field_validator("brand")
    def validate_brand(cls, value):
        if not value or value.strip() == "":
            raise ValueError(
                "Brand is required"
            )
        return value


    @field_validator("ac_type")
    def validate_ac_type(cls, value):
        if not value or value.strip() == "":
            raise ValueError(
                "AC type is required"
            )
        return value
    

    @field_validator("tonnage")
    def validate_tonnage(cls, value):
        allowed = [0.75, 0.8, 1.0, 1.2, 1.5, 1.6, 1.8, 2.0, 2.5, 3.0]
        if value not in allowed:
            raise ValueError(
                "Invalid tonnage selected"
            )
        return value


    @field_validator("star_rating")
    def validate_star(cls, value):
        if value not in [1,2,3,4,5]:
            raise ValueError(
                "Star rating must be between 1 and 5"
            )
        return value


    @field_validator("inverter")
    def validate_inverter(cls,value):
        if value not in [0,1]:
            raise ValueError(
                "Inverter value must be 0 or 1"
            )
        return value


    @field_validator("wifi_enabled")
    def validate_wifi(cls,value):
        if value not in [0,1]:
            raise ValueError(
                "Wifi value must be 0 or 1"
            )
        return value


    @field_validator("rating")
    def validate_rating(cls,value):
        if value < 1 or value > 5:
            raise ValueError(
                "Rating must be between 1 and 5"
            )
        return value


    @field_validator("bought_last_month")
    def validate_bought(cls,value):
        if value < 0:
            raise ValueError(
                "Bought last month cannot be negative"
            )
        if value > 10000:
            raise ValueError(
                "Bought last month cannot exceed 10000"
            )
        return value