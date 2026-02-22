'use client';

import { MapPin } from "lucide-react";
import { HousingHeatmap } from "./housing-heatmap";

export function MapPanel() {
  return (
    <div
      className="flex h-full flex-col rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #e3e6ed" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#edf2ff" }}
          >
            <MapPin className="h-4 w-4" style={{ color: "#4a90d9" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "#1e2533" }}>
              US Housing Occupancy Heatmap
            </h2>
            <p className="text-xs" style={{ color: "#8b93a7" }}>
              Housing unit density by zipcode (2011-2022)
            </p>
          </div>
        </div>
        <span
          className="rounded-xl px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: "#f0f2f7", color: "#8b93a7" }}
        >
          Interactive Heatmap
        </span>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <HousingHeatmap />
      </div>
    </div>
  );
}
