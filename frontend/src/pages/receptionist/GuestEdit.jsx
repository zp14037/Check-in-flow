import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Camera,
  CheckCircle2,
  MessageCircle,
  Copy,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/receptionist/TopBar";
import SourcePill from "../../components/receptionist/SourcePill";
import StatusPillLight from "../../components/receptionist/StatusPillLight";
import { toast } from "../../components/receptionist/ToastHost";

const RELATIONSHIPS = ["Spouse", "Parent", "Child", "Sibling", "Friend", "Colleague"];
const ID_TYPES = ["Aadhaar Card", "Passport", "Driving Licence", "Voter ID"];
const NATIONALITIES = ["Indian", "American", "British", "Emirati", "Singaporean", "Other"];

export default function GuestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservations, updateReservation, markCheckedIn, markIdVerified } = useApp();
  const reservation = reservations.find((r) => r.id === decodeURIComponent(id));

  const [primary, setPrimary] = useState({
    fullName: "",
    mobile: "",
    email: "",
    nationality: "Indian",
    dob: "",
    idType: "",
    idFile: null,
  });
  const [coGuests, setCoGuests] = useState([]);
  const [childGuests, setChildGuests] = useState([]);
  const [occasion, setOccasion] = useState("");
  const [occasionDetail, setOccasionDetail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Hydrate form from reservation
  useEffect(() => {
    if (!reservation) return;
    const p = reservation.primaryGuest || {};
    setPrimary({
      fullName: p.fullName || reservation.guestName || "",
      mobile: p.mobile || reservation.mobile || "",
      email: p.email && p.email !== "—" ? p.email : "",
      nationality: p.nationality || "Indian",
      dob: p.dob || "",
      idType: p.idType || "",
      idFile: p.idFile || null,
    });
    setCoGuests(reservation.coGuests || []);
    setChildGuests(reservation.childGuests || []);
    setOccasion(reservation.occasion || "");
    setOccasionDetail(reservation.occasionDetail || "");
    setSpecialRequest(reservation.specialRequest || "");
  }, [reservation?.id]); // eslint-disable-line

  if (!reservation) {
    return (
      <div>
        <TopBar title="Guest not found" subtitle="" />
        <div className="p-8">
          <button
            onClick={() => navigate("/receptionist")}
            className="text-[#C9A84C] font-ui text-[12px] uppercase tracking-[0.18em]"
          >
            ← Back to arrivals
          </button>
        </div>
      </div>
    );
  }

  const saveAll = () => {
    updateReservation(reservation.id, {
      primaryGuest: {
        fullName: primary.fullName,
        mobile: primary.mobile,
        email: primary.email || "—",
        nationality: primary.nationality,
        country: primary.nationality === "Indian" ? "India" : primary.nationality,
        dob: primary.dob,
        idType: primary.idType,
        idFile: primary.idFile,
      },
      guestName: primary.fullName || reservation.guestName,
      mobile: primary.mobile,
      noContact: !primary.mobile,
      coGuests,
      childGuests,
      occasion,
      occasionDetail,
      specialRequest,
    });
    toast(`✅ ${primary.fullName || reservation.guestName} updated`);
  };

  const sendWhatsApp = () => {
    if (!primary.mobile) {
      toast("⚠ Capture guest mobile first");
      return;
    }
    saveAll();
    const linkBase = window.location.origin + "/guest";
    const link = `${linkBase}?r=${encodeURIComponent(reservation.id)}`;
    const message = `Namaste ${primary.fullName?.split(" ")[0] || "Guest"} 🙏, your Della Resorts pre-arrival check-in for ${reservation.id} (${reservation.roomType}) is ready. Tap to complete: ${link}`;
    const waLink = `https://wa.me/${primary.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    try {
      navigator.clipboard?.writeText(link);
    } catch (e) {
      /* ignore */
    }
    window.open(waLink, "_blank", "noopener,noreferrer");
    toast(`💬 Prefilled link sent to ${primary.mobile}`);
  };

  const approveCheckin = () => {
    if (!reservation.idVerified) markIdVerified(reservation.id);
    markCheckedIn(reservation.id);
    toast(`✅ ${primary.fullName || reservation.guestName} checked in`);
    setTimeout(() => navigate("/receptionist"), 600);
  };

  const addCoGuest = () =>
    setCoGuests((arr) => [
      ...arr,
      { fullName: "", relationship: "Spouse", nationality: "Indian", dob: "", idType: "", idFile: null },
    ]);
  const updateCoGuest = (i, patch) =>
    setCoGuests((arr) => arr.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const removeCoGuest = (i) => setCoGuests((arr) => arr.filter((_, idx) => idx !== i));

  const addChild = () =>
    setChildGuests((arr) => [...arr, { name: "", age: "", dob: "", guardian: primary.fullName }]);
  const updateChild = (i, patch) =>
    setChildGuests((arr) => arr.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const removeChild = (i) => setChildGuests((arr) => arr.filter((_, idx) => idx !== i));

  const qrValue = `DELLA-${reservation.id}-${(primary.fullName || "GUEST").replace(/\s+/g, "-").toUpperCase()}`;

  return (
    <div data-testid="guest-edit-page">
      <TopBar
        title={primary.fullName || reservation.guestName}
        subtitle={`${reservation.id} · ${reservation.roomNumber} · ${reservation.roomType}`}
      />

      <div className="p-6 lg:p-8">
        <button
          onClick={() => navigate("/receptionist")}
          data-testid="edit-back"
          className="inline-flex items-center gap-1.5 text-[11px] font-ui uppercase tracking-[0.18em] text-[#6B7280] hover:text-[#C9A84C] transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Back to Today's Arrivals
        </button>

        {/* Top summary strip */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5 flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">Booking</p>
            <p className="font-body text-[14px] text-[#1a1a1a]">{reservation.id} · {reservation.roomType} · {reservation.roomNumber}</p>
          </div>
          <div className="flex-1 min-w-[180px]">
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">Expected</p>
            <p className="font-body text-[14px] text-[#1a1a1a]">{reservation.arrival} · {reservation.expectedTime || "3:00 PM"}</p>
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">Source</p>
            <div className="mt-1"><SourcePill source={reservation.source} /></div>
          </div>
          <div>
            <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF]">Status</p>
            <div className="mt-1">
              {reservation.checkedIn ? (
                <StatusPillLight kind="checkedin" />
              ) : reservation.idVerified ? (
                <StatusPillLight kind="verified" label="✅ Verified" />
              ) : reservation.formSubmitted ? (
                <StatusPillLight kind="submitted" />
              ) : reservation.noContact ? (
                <StatusPillLight kind="nocontact" />
              ) : (
                <StatusPillLight kind="pending" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary guest card */}
            <Card title="Primary Guest" subtitle="Reception-editable. Updates the booking on file.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <LightField label="Full Name" value={primary.fullName} onChange={(v) => setPrimary({ ...primary, fullName: v })} required dataTestid="primary-name" />
                <LightField label="Mobile" value={primary.mobile} onChange={(v) => setPrimary({ ...primary, mobile: v })} placeholder="+91 …" required dataTestid="primary-mobile" />
                <LightField label="Email" type="email" value={primary.email} onChange={(v) => setPrimary({ ...primary, email: v })} placeholder="guest@example.com" dataTestid="primary-email" />
                <LightSelect label="Nationality" value={primary.nationality} onChange={(v) => setPrimary({ ...primary, nationality: v })} options={NATIONALITIES} />
                <LightField label="Date of Birth" type="date" value={primary.dob} onChange={(v) => setPrimary({ ...primary, dob: v })} />
                <LightSelect label="ID Type" value={primary.idType} onChange={(v) => setPrimary({ ...primary, idType: v })} options={ID_TYPES} placeholder="Select…" />
              </div>
              <IdUpload
                value={primary.idFile}
                onChange={(f) => setPrimary({ ...primary, idFile: f })}
                dataTestid="primary-id-upload"
              />
            </Card>

            {/* Co-guests */}
            <Card
              title={`Co-Guests (${coGuests.length})`}
              subtitle="Empty by default — OTAs and direct bookings do not provide co-guest details."
              actions={
                <button
                  onClick={addCoGuest}
                  data-testid="add-co-guest"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  <Plus size={12} /> Add Co-Guest
                </button>
              }
            >
              {coGuests.length === 0 ? (
                <EmptyHint text="No co-guests on file. Click 'Add Co-Guest' or send the WhatsApp form so the guest can add them." />
              ) : (
                <div className="space-y-5">
                  {coGuests.map((g, i) => (
                    <div key={i} className="rounded-xl border border-[#E8E2D9] p-4" data-testid={`co-guest-${i}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
                          Guest {i + 2} · Adult
                        </p>
                        <button
                          onClick={() => removeCoGuest(i)}
                          className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <LightField label="Full Name" value={g.fullName} onChange={(v) => updateCoGuest(i, { fullName: v })} dataTestid={`co-guest-name-${i}`} />
                        <LightSelect label="Relationship" value={g.relationship} onChange={(v) => updateCoGuest(i, { relationship: v })} options={RELATIONSHIPS} />
                        <LightSelect label="Nationality" value={g.nationality} onChange={(v) => updateCoGuest(i, { nationality: v })} options={NATIONALITIES} />
                        <LightField label="Date of Birth" type="date" value={g.dob} onChange={(v) => updateCoGuest(i, { dob: v })} />
                        <LightSelect label="ID Type" value={g.idType} onChange={(v) => updateCoGuest(i, { idType: v })} options={ID_TYPES} placeholder="Select…" />
                      </div>
                      <IdUpload value={g.idFile} onChange={(f) => updateCoGuest(i, { idFile: f })} compact />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Children */}
            <Card
              title={`Children (${childGuests.length})`}
              subtitle="Empty by default — added either by guest via WhatsApp form or by reception here."
              actions={
                <button
                  onClick={addChild}
                  data-testid="add-child"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  <Plus size={12} /> Add Child
                </button>
              }
            >
              {childGuests.length === 0 ? (
                <EmptyHint text="No children recorded for this booking." />
              ) : (
                <div className="space-y-4">
                  {childGuests.map((c, i) => (
                    <div key={i} className="rounded-xl border border-[#E8E2D9] p-4 grid grid-cols-1 md:grid-cols-4 gap-x-6" data-testid={`child-${i}`}>
                      <LightField label="Name" value={c.name} onChange={(v) => updateChild(i, { name: v })} />
                      <LightField label="Age" type="number" value={c.age} onChange={(v) => updateChild(i, { age: v })} />
                      <LightField label="DOB" type="date" value={c.dob} onChange={(v) => updateChild(i, { dob: v })} />
                      <div className="flex items-end gap-3">
                        <LightField label="Guardian" value={c.guardian} onChange={(v) => updateChild(i, { guardian: v })} />
                        <button onClick={() => removeChild(i)} className="mb-3 text-[#9CA3AF] hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Occasion + Special Request */}
            <Card title="Occasion & Notes" subtitle="Optional — improves the guest's welcome experience.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <LightSelect
                  label="Occasion"
                  value={occasion}
                  onChange={setOccasion}
                  options={["", "Birthday", "Anniversary", "Honeymoon", "Corporate", "Wedding Guest", "Just a Getaway"]}
                  placeholder="— none —"
                />
                <LightField label="Occasion Detail" value={occasionDetail} onChange={setOccasionDetail} placeholder="e.g. 14th Anniversary · 20 Feb" />
              </div>
              <label className="block mt-3">
                <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
                  Special Request
                </span>
                <textarea
                  rows={3}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  data-testid="special-request"
                  placeholder="Surprise cake, rose petals, early check-in, specific pillow preferences…"
                  className="w-full bg-transparent border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a] resize-none italic placeholder:text-[#9CA3AF]"
                />
              </label>
            </Card>
          </div>

          {/* Right rail */}
          <aside className="space-y-5">
            {/* Actions */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5">
              <h3 className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] font-semibold">
                Reception Actions
              </h3>
              <div className="mt-4 space-y-3">
                <button
                  onClick={saveAll}
                  data-testid="save-guest"
                  className="w-full h-11 rounded-full border border-[#E8E2D9] text-[#1a1a1a] hover:border-[#C9A84C] hover:text-[#C9A84C] font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={13} /> Save Changes
                </button>
                <button
                  onClick={sendWhatsApp}
                  data-testid="send-prefilled-wa"
                  className="w-full h-11 rounded-full bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.99] text-white font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={13} /> Send Prefilled WhatsApp
                </button>
                <button
                  onClick={() => setShowQR((s) => !s)}
                  data-testid="toggle-qr"
                  className="w-full h-11 rounded-full bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-[0.99] text-[#0D0D0D] font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-all"
                >
                  {showQR ? "Hide QR" : "Generate QR for Form"}
                </button>
                {!reservation.idVerified && (
                  <button
                    onClick={() => { markIdVerified(reservation.id); toast(`✅ ID verified`); }}
                    data-testid="verify-id-action"
                    className="w-full h-11 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={13} /> Verify ID
                  </button>
                )}
                <button
                  onClick={approveCheckin}
                  disabled={reservation.checkedIn}
                  data-testid="approve-checkin"
                  className="w-full h-12 rounded-full bg-[#0D1F0F] hover:bg-[#0a1a0d] disabled:opacity-50 disabled:cursor-not-allowed text-[#E8C97A] font-ui text-[12px] font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck size={14} />
                  {reservation.checkedIn ? "Already Checked-In" : "Approve & Check-In"}
                </button>
              </div>
            </div>

            {/* QR preview */}
            {showQR && (
              <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5 text-center" data-testid="guest-qr">
                <h3 className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] font-semibold">
                  Prefilled Check-In QR
                </h3>
                <div className="mt-4 inline-block rounded-xl border-2 border-[#C9A84C] bg-[#0D0D0D] p-3">
                  <QRCodeSVG value={qrValue} size={150} fgColor="#C9A84C" bgColor="#0D0D0D" />
                </div>
                <p className="mt-3 font-ui text-[9px] uppercase tracking-[0.2em] text-[#6B7280] break-all">
                  {qrValue}
                </p>
                <button
                  onClick={() => {
                    try { navigator.clipboard?.writeText(window.location.origin + "/guest?r=" + reservation.id); } catch (e) { /* ignore */ }
                    toast("📋 Link copied");
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-ui text-[#6B7280] hover:text-[#C9A84C] transition-colors"
                >
                  <Copy size={12} /> Copy direct link
                </button>
              </div>
            )}

            {/* IDS sync */}
            <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-5">
              <h3 className="font-ui text-[10px] uppercase tracking-[0.22em] text-[#9CA3AF] font-semibold">
                IDS FortuneNext
              </h3>
              <div className="mt-2">
                {reservation.idsSync?.status === "synced" ? (
                  <StatusPillLight kind="verified" label={`✅ Synced · ${reservation.idsSync.at}`} />
                ) : (
                  <StatusPillLight kind="pending" label="⏳ Pending RPA Sync" />
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, actions, children }) {
  return (
    <section className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display italic text-[22px] text-[#1a1a1a] leading-tight">{title}</h2>
          {subtitle && <p className="font-body text-[12px] text-[#6B7280] mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E8E2D9] bg-[#FAFAF8] p-5 text-center">
      <p className="font-body text-[12px] text-[#9CA3AF] italic">{text}</p>
    </div>
  );
}

function LightField({ label, value, onChange, type = "text", placeholder, required, dataTestid }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label} {required && <span className="text-[#C9A84C]">*</span>}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={dataTestid}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a] transition-colors"
      />
    </label>
  );
}

function LightSelect({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block mt-3">
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        {label}
      </span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-[#E8E2D9] focus:border-[#C9A84C] outline-none py-2 font-body text-[14px] text-[#1a1a1a]"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "— none —"}
          </option>
        ))}
      </select>
    </label>
  );
}

function IdUpload({ value, onChange, compact = false, dataTestid }) {
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onChange(f.name); // mock — store filename only
  };
  const fileName = typeof value === "string" ? value : value?.name;
  return (
    <div className={compact ? "mt-3" : "mt-4"}>
      <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
        Government ID Upload
      </span>
      <label
        className="mt-2 block rounded-xl border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-[#FBF8F2] hover:bg-[#FAF3DF] cursor-pointer transition-colors text-center px-4 py-5"
      >
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFile}
          data-testid={dataTestid}
        />
        <Camera size={18} className="mx-auto text-[#C9A84C]" />
        <p className="mt-2 font-ui text-[12px] text-[#1a1a1a]">
          {fileName ? `Uploaded · ${fileName}` : "Click to upload ID (or drag & drop)"}
        </p>
        <p className="font-body text-[10px] text-[#9CA3AF] mt-0.5">
          {fileName ? "Replace by clicking again" : "JPG, PNG or PDF · Max 5MB"}
        </p>
      </label>
    </div>
  );
}
