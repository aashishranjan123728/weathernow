import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavoriteCity extends Document {
  userId: string;
  cityName: string;
  country: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  createdAt: Date;
}

const FavoriteCitySchema = new Schema<IFavoriteCity>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cityName: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lon: { type: Number },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate favorites per user
FavoriteCitySchema.index({ userId: 1, cityName: 1, country: 1 }, { unique: true });

export const FavoriteCity: Model<IFavoriteCity> =
  mongoose.models.FavoriteCity || mongoose.model<IFavoriteCity>("FavoriteCity", FavoriteCitySchema);
export default FavoriteCity;

