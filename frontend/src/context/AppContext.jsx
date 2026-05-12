import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * AppContext — Session memory for the Della Resorts demo.
 * Persists across screens & page refreshes via localStorage.
 */

const STORAGE_KEY = "della_resorts_state_v1";

const seedReservations = [
  {
    id: "RES-2401",
    guestName: "Aarav Mehta",
    roomType: "Cliff Villa",
    roomNumber: "CV-12",
    source: "direct",
    arrival: "2026-02-18",
    nights: 2,
    guests: 2,
    adults: 2,
    children: 1,
    mealPlan: "Breakfast",
    primaryGuest: {
      fullName: "Aarav Mehta",
      mobile: "+91 98200 45621",
      email: "aarav.m@gmail.com",
      nationality: "Indian",
      country: "India",
    },
    coGuests: [
      { fullName: "", relationship: "", nationality: "", dob: "", idType: "" },
    ],
    childGuests: [{ name: "Arjun", age: 6, guardian: "Aarav Mehta", dob: "" }],
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
    checkinPayload: null,
  },
  {
    id: "RES-2402",
    guestName: "Priya Iyer",
    roomType: "Lake Suite",
    roomNumber: "LS-04",
    source: "booking",
    arrival: "2026-02-18",
    nights: 3,
    guests: 2,
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
  {
    id: "RES-2403",
    guestName: "Rohan Kapoor",
    roomType: "Forest Cabana",
    roomNumber: "FC-21",
    source: "mmt",
    arrival: "2026-02-18",
    nights: 1,
    guests: 4,
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
  {
    id: "RES-2404",
    guestName: "Kavya Sharma",
    roomType: "Royal Penthouse",
    roomNumber: "RP-01",
    source: "sales",
    arrival: "2026-02-19",
    nights: 4,
    guests: 2,
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
  {
    id: "RES-2405",
    guestName: "Vikram Singh",
    roomType: "Lake Suite",
    roomNumber: "LS-09",
    source: "whatsapp",
    arrival: "2026-02-18",
    nights: 2,
    guests: 3,
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
  {
    id: "RES-2406",
    guestName: "Mehra Family (Group)",
    roomType: "Group Block · 8 rooms",
    roomNumber: "BLK-2",
    source: "group",
    arrival: "2026-02-19",
    nights: 2,
    guests: 24,
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
  {
    id: "RES-2407",
    guestName: "Anita Desai",
    roomType: "Standard Room",
    roomNumber: "SR-32",
    source: "walkin",
    arrival: "2026-02-18",
    nights: 1,
    guests: 1,
    status: "Hold",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
  },
];

const defaultState = {
  reservations: seedReservations,
  activityLog: [
    {
      ts: Date.now() - 1000 * 60 * 45,
      actor: "system",
      message: "Daily arrival manifest synced from PMS",
    },
  ],
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [state]);

  const logActivity = useCallback((actor, message) => {
    setState((s) => ({
      ...s,
      activityLog: [{ ts: Date.now(), actor, message }, ...s.activityLog].slice(0, 100),
    }));
  }, []);

  const updateReservation = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const markFormSubmitted = useCallback(
    (id, payload = null) => {
      updateReservation(id, {
        formSubmitted: true,
        checkinStatus: "Form Submitted",
        checkinPayload: payload,
      });
      logActivity("guest", `Pre-check-in form submitted for ${id}`);
    },
    [updateReservation, logActivity]
  );

  const markIdVerified = useCallback(
    (id) => {
      updateReservation(id, { idVerified: true, checkinStatus: "ID Verified" });
      logActivity("receptionist", `ID verified for ${id}`);
    },
    [updateReservation, logActivity]
  );

  const resetDemo = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    ...state,
    logActivity,
    updateReservation,
    markFormSubmitted,
    markIdVerified,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider />");
  return ctx;
}
