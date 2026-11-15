import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWeatherHistory extends Document {
  userId: string;
  cityName: string;
  temperature: number;
  weatherCondition: string;
  humidity: number;
  windSpeed: number;
  searchedAt: Date;
}

const WeatherHistorySchema = new Schema<IWeatherHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    weatherCondition: {
      type: String,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Limit results query by userId and sort by searchedAt
WeatherHistorySchema.index({ userId: 1, searchedAt: -1 });

export const WeatherHistory: Model<IWeatherHistory> =
  mongoose.models.WeatherHistory || mongoose.model<IWeatherHistory>("WeatherHistory", WeatherHistorySchema);
export default WeatherHistory;

