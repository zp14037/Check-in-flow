import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * AppContext — Session memory for the Della Resorts demo.
 * Persists across screens & page refreshes via localStorage.
 */

const STORAGE_KEY = "della_resorts_state_v5";

const GROUP_NAMES = [
  "Aakash Iyer", "Pooja Reddy", "Karan Bhatt", "Sneha Pillai", "Manish Gupta", "Riya Joseph",
  "Aditya Nair", "Tanvi Singh", "Devansh Khanna", "Meera Kulkarni", "Harshad Patel", "Ananya Joshi",
  "Yash Malhotra", "Diya Saxena", "Ishaan Roy", "Nitya Aggarwal", "Aryan Bose", "Sara Banerjee",
  "Vihaan Chaudhary", "Aanya Pillai", "Rohit Menon", "Kritika Verma", "Aman Kapoor", "Tara Shetty",
  "Dhruv Pandey", "Ira Sethi", "Kabir Sharma", "Naina Bedi", "Mihir Trivedi", "Avni Rastogi",
  "Sahil Khurana", "Zoya Ansari",
];

function makeGroupGuests() {
  return GROUP_NAMES.map((name, i) => ({
    id: `GRP-G${String(i + 1).padStart(2, "0")}`,
    name,
    mobile: i < 18 ? `+91 98${String(10000 + i * 113).slice(0, 5)} ${String(10000 + i * 211).slice(0, 5)}` : "",
    idType: i < 18 ? "Aadhaar Card" : "",
    idFile: i < 18 ? `aadhaar_${i + 1}.jpg` : null,
    submitted: i < 18,
    signed: i < 18,
    submittedAt: i < 18 ? Date.now() - (32 - i) * 60_000 : null,
  }));
}

const seedReservations = [
  {
    id: "RES-2401",
    guestName: "Aarav Mehta",
    roomType: "Cliff Villa",
    roomNumber: "CV-12",
    source: "direct",
    arrival: "2026-02-18",
    expectedTime: "3:00 PM",
    nights: 2,
    guests: 2,
    adults: 2,
    children: 1,
    mealPlan: "Breakfast Included",
    mobile: "+91 98200 45621",
    primaryGuest: {
      fullName: "Aarav Mehta",
      mobile: "+91 98200 45621",
      email: "aarav.m@gmail.com",
      nationality: "Indian",
      country: "India",
    },
    coGuests: [],
    childGuests: [],
    occasion: "",
    occasionDetail: "",
    specialRequest: "",
    idsSync: { status: "synced", at: "10:24 AM" },
    status: "Confirmed",
    checkinStatus: "Pending",
    idVerified: false,
    formSubmitted: false,
    checkedIn: false,
    checkinPayload: null,
  },
  { id: "RES-2402", guestName: "Priya Sharma", roomType: "Lake Suite", roomNumber: "LS-04", source: "direct", arrival: "2026-02-18", expectedTime: "2:00 PM", nights: 3, adults: 2, children: 0, mobile: "+91 98765 11220", primaryGuest: { fullName: "Priya Sharma", mobile: "+91 98765 11220", email: "priya.sharma@example.com", nationality: "Indian", country: "India" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "Pending", idsSync: { status: "synced", at: "09:50 AM" } },
  { id: "BCom-8812", guestName: "James Wilson", roomType: "Superior", roomNumber: "SR-11", source: "booking", arrival: "2026-02-18", expectedTime: "4:00 PM", nights: 2, adults: 2, children: 0, mobile: "", primaryGuest: { fullName: "James Wilson", mobile: "", email: "—", nationality: "British", country: "UK" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "No Contact", noContact: true, idsSync: { status: "pending" } },
  { id: "MMT-4421", guestName: "Neha Kapoor", roomType: "Designer Suite", roomNumber: "DS-02", source: "mmt", arrival: "2026-02-18", expectedTime: "1:00 PM", nights: 2, adults: 2, children: 1, mobile: "+91 98311 22334", primaryGuest: { fullName: "Neha Kapoor", mobile: "+91 98311 22334", email: "neha.k@example.com", nationality: "Indian", country: "India" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "Pending", idsSync: { status: "synced", at: "10:01 AM" } },
  { id: "SLS-1102", guestName: "Rahul Verma", roomType: "Conference", roomNumber: "CF-01", source: "sales", arrival: "2026-02-18", expectedTime: "12:00 PM", nights: 1, adults: 1, children: 0, mobile: "+91 99887 76655", primaryGuest: { fullName: "Rahul Verma", mobile: "+91 99887 76655", email: "rahul@acmecorp.com", nationality: "Indian", country: "India" }, formSubmitted: true, idVerified: true, checkedIn: false, checkinStatus: "ID Verified", idsSync: { status: "synced", at: "09:30 AM" } },
  { id: "GRP-0091", guestName: "TCS Group", roomType: "12 Rooms", roomNumber: "GRP-A", source: "group", arrival: "2026-02-18", expectedTime: "11:00 AM", nights: 2, adults: 32, children: 0, mobile: "+91 98201 11111", primaryGuest: { fullName: "TCS Group Coordinator", mobile: "+91 98201 11111", email: "events@tcs.com", nationality: "Indian", country: "India" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "Group · 18/32", isGroup: true, groupTotal: 32, groupCheckedIn: 18, idsSync: { status: "synced", at: "08:45 AM" } },
  { id: "WA-0032", guestName: "Aisha Khan", roomType: "Camp Tent", roomNumber: "CT-05", source: "whatsapp", arrival: "2026-02-18", expectedTime: "5:00 PM", nights: 2, adults: 2, children: 0, mobile: "+91 90909 12121", primaryGuest: { fullName: "Aisha Khan", mobile: "+91 90909 12121", email: "aisha.k@example.com", nationality: "Indian", country: "India" }, formSubmitted: true, idVerified: false, checkedIn: false, checkinStatus: "Form Submitted", idsSync: { status: "synced", at: "10:12 AM" } },
  { id: "BCom-9002", guestName: "David Lee", roomType: "Luxury", roomNumber: "LR-08", source: "booking", arrival: "2026-02-18", expectedTime: "6:00 PM", nights: 2, adults: 2, children: 0, mobile: "", primaryGuest: { fullName: "David Lee", mobile: "", email: "—", nationality: "Singaporean", country: "Singapore" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "No Contact", noContact: true, idsSync: { status: "pending" } },
  { id: "DL-2024895", guestName: "Sunita Rao", roomType: "Enclave", roomNumber: "EV-03", source: "direct", arrival: "2026-02-18", expectedTime: "3:30 PM", nights: 2, adults: 2, children: 0, mobile: "+91 98112 33445", primaryGuest: { fullName: "Sunita Rao", mobile: "+91 98112 33445", email: "sunita.r@example.com", nationality: "Indian", country: "India" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "Pending", idsSync: { status: "synced", at: "09:55 AM" } },
  { id: "MMT-5521", guestName: "Kabir Mehta", roomType: "Adventure", roomNumber: "AR-14", source: "mmt", arrival: "2026-02-18", expectedTime: "2:30 PM", nights: 1, adults: 2, children: 0, mobile: "+91 98700 88990", primaryGuest: { fullName: "Kabir Mehta", mobile: "+91 98700 88990", email: "kabir.m@example.com", nationality: "Indian", country: "India" }, formSubmitted: false, idVerified: false, checkedIn: false, checkinStatus: "Pending", idsSync: { status: "synced", at: "09:40 AM" } },
  { id: "WED-0011", guestName: "Sharma Wedding", roomType: "Presidential", roomNumber: "PS-01", source: "sales", arrival: "2026-02-18", expectedTime: "10:00 AM", nights: 3, adults: 4, children: 0, mobile: "+91 90000 11111", primaryGuest: { fullName: "Vihaan Sharma", mobile: "+91 90000 11111", email: "vihaan@example.com", nationality: "Indian", country: "India" }, formSubmitted: true, idVerified: true, checkedIn: false, checkinStatus: "ID Verified", idsSync: { status: "synced", at: "08:30 AM" } },
];

const defaultState = {
  reservations: seedReservations,
  notifications: 3,
  activityLog: [
    { ts: Date.now() - 1000 * 60 * 45, actor: "system", message: "Daily arrival manifest synced from PMS" },
    { ts: Date.now() - 1000 * 60 * 30, actor: "system", message: "IDS FortuneNext: 9 of 11 bookings synced" },
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
        formSubmittedAt: Date.now(),
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

  const markCheckedIn = useCallback(
    (id) => {
      updateReservation(id, {
        checkedIn: true,
        checkinStatus: "Checked-In",
        checkedInAt: Date.now(),
      });
      logActivity("receptionist", `Checked in ${id}`);
    },
    [updateReservation, logActivity]
  );

  const captureMobile = useCallback(
    (id, mobile) => {
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) =>
          r.id === id
            ? {
                ...r,
                mobile,
                noContact: false,
                checkinStatus: "Pending",
                primaryGuest: { ...(r.primaryGuest || {}), mobile },
              }
            : r
        ),
      }));
      logActivity("receptionist", `Mobile captured for ${id}: ${mobile}`);
    },
    [logActivity]
  );

  const createWalkin = useCallback(
    (data) => {
      const id = `WLK-${String(Date.now()).slice(-4)}`;
      const newRes = {
        id,
        guestName: data.fullName,
        roomType: data.roomType,
        roomNumber: data.roomNumber || "TBD",
        source: "walkin",
        arrival: new Date().toISOString().slice(0, 10),
        expectedTime: "Now",
        nights: data.nights,
        adults: data.adults,
        children: data.children,
        mobile: data.mobile,
        primaryGuest: {
          fullName: data.fullName,
          mobile: data.mobile,
          email: "—",
          nationality: "Indian",
          country: "India",
        },
        occasion: data.occasion,
        formSubmitted: false,
        idVerified: false,
        checkedIn: false,
        checkinStatus: "Link Sent",
        idsSync: { status: "synced", at: "Just Now" },
        isWalkin: true,
      };
      setState((s) => ({ ...s, reservations: [newRes, ...s.reservations] }));
      logActivity("receptionist", `Walk-in created · ${data.fullName} · link sent to ${data.mobile}`);
      return id;
    },
    [logActivity]
  );

  const addReservation = useCallback(
    (data) => {
      const id =
        data.id ||
        `${data.sourcePrefix || "RES"}-${String(Date.now()).slice(-4)}`;
      const newRes = {
        id,
        guestName: data.guestName || data.fullName,
        roomType: data.roomType,
        roomNumber: data.roomNumber || "TBD",
        source: data.source || "direct",
        arrival: data.arrival || new Date().toISOString().slice(0, 10),
        expectedTime: data.expectedTime || "3:00 PM",
        nights: data.nights || 1,
        adults: data.adults || 2,
        children: data.children || 0,
        mobile: data.mobile || "",
        primaryGuest: {
          fullName: data.fullName,
          mobile: data.mobile || "",
          email: data.email || "—",
          nationality: data.nationality || "Indian",
          country: data.country || "India",
        },
        coGuests: [],
        childGuests: [],
        occasion: data.occasion || "",
        specialRequest: data.specialRequest || "",
        formSubmitted: false,
        idVerified: false,
        checkedIn: false,
        checkinStatus: "Pending",
        idsSync: { status: "synced", at: "Just Now" },
        company: data.company,
      };
      setState((s) => ({ ...s, reservations: [newRes, ...s.reservations] }));
      logActivity(
        data.actor || "sales",
        `${data.actor === "sales" ? "Sales lead" : "Booking"} created · ${
          data.fullName
        } · ${id}`
      );
      return id;
    },
    [logActivity]
  );

  const markGroupGuestSubmitted = useCallback(
    (reservationId, guestId, patch = {}) => {
      setState((s) => ({
        ...s,
        reservations: s.reservations.map((r) => {
          if (r.id !== reservationId) return r;
          const groupGuests = (r.groupGuests || []).map((g) =>
            g.id === guestId
              ? { ...g, submitted: true, signed: true, submittedAt: Date.now(), ...patch }
              : g
          );
          const submittedCount = groupGuests.filter((g) => g.submitted).length;
          return {
            ...r,
            groupGuests,
            groupCheckedIn: submittedCount,
            checkinStatus: `Group · ${submittedCount}/${r.groupTotal}`,
          };
        }),
      }));
      logActivity("group-guest", `Group guest ${guestId} submitted under ${reservationId}`);
    },
    [logActivity]
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
    markCheckedIn,
    captureMobile,
    createWalkin,
    addReservation,
    markGroupGuestSubmitted,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider />");
  return ctx;
}
