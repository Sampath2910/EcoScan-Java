package com.ecoscan.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecyclerService {

    private static final List<Map<String, Object>> ALL_RECYCLERS = List.of(
            Map.of("id", 1, "name", "Hyderabad Municipal Recycling Center", "type", "Plastic",    "city", "Hyderabad",     "lat", 17.3850, "lng", 78.4867),
            Map.of("id", 2, "name", "Green Earth Paper Recyclers",          "type", "Paper",     "city", "Secunderabad",  "lat", 17.4399, "lng", 78.4983),
            Map.of("id", 3, "name", "EcoMetal Industries",                  "type", "Metal",     "city", "Gachibowli",   "lat", 17.4401, "lng", 78.3489),
            Map.of("id", 4, "name", "GlassCycle Telangana",                 "type", "Glass",     "city", "Miyapur",      "lat", 17.4948, "lng", 78.3996),
            Map.of("id", 5, "name", "Zero Waste Plastic Recyclers",         "type", "Plastic",   "city", "Kukatpally",   "lat", 17.4849, "lng", 78.4138),
            Map.of("id", 6, "name", "ReNew E-Waste Recycling",              "type", "E-Waste",   "city", "Banjara Hills","lat", 17.4127, "lng", 78.4367),
            Map.of("id", 7, "name", "Metro Metal Scrap Traders",            "type", "Metal",     "city", "Chandanagar",  "lat", 17.4435, "lng", 78.3528),
            Map.of("id", 8, "name", "PaperCycle Pvt Ltd",                   "type", "Paper",     "city", "HITEC City",   "lat", 17.4470, "lng", 78.3762),
            Map.of("id", 9, "name", "GlassSmart Solutions",                 "type", "Glass",     "city", "Malkajgiri",   "lat", 17.5103, "lng", 78.5593),
            Map.of("id", 10, "name", "Green Plast Recyclers",               "type", "Plastic",   "city", "Uppal",        "lat", 17.3833, "lng", 78.5465),
            Map.of("id", 11, "name", "Secunderabad Metal Works",            "type", "Metal",     "city", "Secunderabad", "lat", 17.4399, "lng", 78.4983),
            Map.of("id", 12, "name", "EcoBins & Recycling Hub",             "type", "Cardboard",  "city", "Hyderabad",    "lat", 17.3950, "lng", 78.4860),
            Map.of("id", 13, "name", "Mumbai Plastic Works",                "type", "Plastic",   "city", "Mumbai",       "lat", 19.0760, "lng", 72.8777),
            Map.of("id", 14, "name", "Delhi Metal Hub",                     "type", "Metal",     "city", "Delhi",        "lat", 28.7041, "lng", 77.1025),
            Map.of("id", 15, "name", "Bangalore Paper Recyclers",           "type", "Paper",     "city", "Bangalore",    "lat", 12.9716, "lng", 77.5946)
    );

    private static final List<String> HYDERABAD_CITIES = List.of(
            "hyderabad", "secunderabad", "gachibowli", "miyapur", "kukatpally",
            "uppal", "banjara hills", "hitec city", "malkajgiri", "chandanagar"
    );

    public List<Map<String, Object>> getRecyclers(String type, String city) {
        // No filters → show Hyderabad area only
        if ((type == null || type.isBlank()) && (city == null || city.isBlank())) {
            return ALL_RECYCLERS.stream()
                    .filter(r -> HYDERABAD_CITIES.contains(r.get("city").toString().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // With filters → global search
        return ALL_RECYCLERS.stream()
                .filter(r -> type == null || type.isBlank() ||
                             r.get("type").toString().toLowerCase().contains(type.toLowerCase()))
                .filter(r -> city == null || city.isBlank() ||
                             r.get("city").toString().toLowerCase().contains(city.toLowerCase()))
                .collect(Collectors.toList());
    }
}
