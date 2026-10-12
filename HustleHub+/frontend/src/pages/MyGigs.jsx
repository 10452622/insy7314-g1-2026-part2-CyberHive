import React, { useEffect, useState } from "react";
import { Eye, Pause, Pencil, Play, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import FreelancerHeader from "../components/FreelancerHeader";
import { createGig, deleteGig, fetchFreelancerGigs, setGigActive, updateGig } from "../services/api";
import "../styles/FreelancerDashboard.css";
import "../styles/FreelancerManagement.css";

const emptyGig = { title: "", description: "", category: "", price: "", deliveryDays: "7" };
const currency = (amount) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(amount) || 0);

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);
  const [filter, setFilter] = useState("Active");
  const [editingGig, setEditingGig] = useState(null);
  const [form, setForm] = useState(emptyGig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedGigId, setExpandedGigId] = useState("");

  const loadGigs = async () => {
    setError("");
    try {
      const result = await fetchFreelancerGigs();
      setGigs(Array.isArray(result.gigs) ? result.gigs : []);
    } catch (loadError) {
      setError(loadError.message || "Your gigs could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGigs();
  }, []);

  const activeGigs = gigs.filter((gig) => gig.isActive !== false);
  const pausedGigs = gigs.filter((gig) => gig.isActive === false);
  const visibleGigs = filter === "Active" ? activeGigs : filter === "Paused" ? pausedGigs : [];

  const openCreate = () => {
    setEditingGig(null);
    setForm(emptyGig);
    setShowForm(true);
  };

  const openEdit = (gig) => {
    setEditingGig(gig);
    setForm({
      title: gig.title || "",
      description: gig.description || "",
      category: gig.category || "",
      price: String(gig.price ?? ""),
      deliveryDays: String(gig.deliveryDays || 7),
    });
    setShowForm(true);
  };

  const saveGig = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, price: Number(form.price), deliveryDays: Number(form.deliveryDays) };
    try {
      if (editingGig) await updateGig(editingGig._id, payload);
      else await createGig(payload);
      setShowForm(false);
      await loadGigs();
    } catch (saveError) {
      setError(saveError.message || "The gig could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const toggleGig = async (gig) => {
    try {
      await setGigActive(gig._id, !gig.isActive);
      await loadGigs();
    } catch (actionError) {
      setError(actionError.message || "The gig status could not be changed.");
    }
  };

  const removeGig = async (gig) => {
    if (!window.confirm(`Delete “${gig.title}”?`)) return;
    try {
      await deleteGig(gig._id);
      await loadGigs();
    } catch (actionError) {
      setError(actionError.message || "The gig could not be deleted.");
    }
  };

  const tabs = [
    { label: "Active", count: activeGigs.length },
    { label: "Drafts", count: 0 },
    { label: "Paused", count: pausedGigs.length },
  ];

  return (
    <main className="freelancer-dashboard freelancer-management">
      <FreelancerHeader />
      <div className="freelancer-dashboard-content">
        <div className="management-page-heading">
          <div>
            <h1>My Gigs</h1>
            <p>Manage and track your services.</p>
          </div>
          <button className="management-primary-button" type="button" onClick={openCreate}>
            <Plus size={16} /> Create New Gig
          </button>
        </div>

        {error && <p className="management-error" role="alert">{error}</p>}

        <div className="management-tabs" role="tablist" aria-label="Filter gigs">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={filter === tab.label}
              className={filter === tab.label ? "management-tab is-selected" : "management-tab"}
              onClick={() => setFilter(tab.label)}
            >
              {tab.label} <span>{tab.count}</span>
            </button>
          ))}
        </div>

        {filter === "Drafts" ? (
          <div className="management-empty"><h2>No drafts</h2><p>New gigs are saved to your account when you create them.</p></div>
        ) : loading ? (
          <div className="management-empty">Loading your gigs…</div>
        ) : visibleGigs.length === 0 ? (
          <div className="management-empty"><h2>{filter === "Active" ? "No active gigs yet" : "No paused gigs"}</h2><p>{filter === "Active" ? "Create a gig to publish your service for clients." : "Paused gigs will appear here."}</p></div>
        ) : (
          <div className="management-table-wrap">
            <table className="management-table gigs-table">
              <thead>
                <tr><th>Gig</th><th>Category</th><th>Price</th><th>Orders</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {visibleGigs.map((gig) => (
                  <React.Fragment key={gig._id}>
                  <tr>
                    <td className="management-title-cell">{gig.title}</td>
                    <td>{gig.category || "Uncategorized"}</td>
                    <td>{currency(gig.price)}</td>
                    <td>{gig.ordersCount || 0}</td>
                    <td><span className={`management-status ${gig.isActive ? "status-active" : "status-paused"}`}>{gig.isActive ? "Active" : "Paused"}</span></td>
                    <td>
                      <div className="management-actions">
                        <Link className="management-icon-button" to={`/gigs/${gig._id}`} target="_blank" aria-label={`View ${gig.title}`} title="View gig"><Eye size={15} /></Link>
                        <button className="management-icon-button" type="button" onClick={() => openEdit(gig)} aria-label={`Edit ${gig.title}`} title="Edit gig"><Pencil size={15} /></button>
                        <button className="management-icon-button" type="button" onClick={() => setExpandedGigId(expandedGigId === gig._id ? "" : gig._id)} aria-label={`${expandedGigId === gig._id ? "Hide" : "Show"} actions for ${gig.title}`} title="More gig details"><Plus size={16} /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedGigId === gig._id && (
                    <tr className="management-expanded-row">
                      <td colSpan="6">
                        <div className="management-gig-details">
                          <p>{gig.description || "No description provided."}</p>
                          <span>Delivery: {gig.deliveryDays || "—"} days</span>
                          <div>
                            <button type="button" className="management-secondary-action" onClick={() => toggleGig(gig)}>{gig.isActive ? <Pause size={14} /> : <Play size={14} />}{gig.isActive ? "Pause gig" : "Reactivate gig"}</button>
                            <button type="button" className="management-secondary-action management-delete-action" onClick={() => removeGig(gig)}><X size={14} />Delete gig</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="management-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <section className="management-modal" role="dialog" aria-modal="true" aria-labelledby="gig-form-title">
            <div className="management-modal-heading">
              <h2 id="gig-form-title">{editingGig ? "Edit Gig" : "Create New Gig"}</h2>
              <button type="button" className="management-icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={18} /></button>
            </div>
            <form onSubmit={saveGig} className="management-form">
              <label>Gig title<input required minLength="3" maxLength="100" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label>Category<input required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
              <label>Description<textarea required maxLength="2000" rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <div className="management-form-row">
                <label>Price (R)<input required type="number" min="0" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
                <label>Delivery days<input required type="number" min="1" step="1" value={form.deliveryDays} onChange={(event) => setForm({ ...form, deliveryDays: event.target.value })} /></label>
              </div>
              <button className="management-primary-button" type="submit" disabled={saving}>{saving ? "Saving…" : editingGig ? "Save Changes" : "Publish Gig"}</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

/* Reference List
React, 2026. Built-in React Hooks. [online] Available at: <https://react.dev/reference/react/hooks> [Accessed 10 October 2026].
React Router, n.d. Link. [online] Available at: <https://reactrouter.com/api/components/Link> [Accessed 10 October 2026].
Lucide, n.d. Lucide for React. [online] Available at: <https://lucide.dev/guide/packages/lucide-react> [Accessed 10 October 2026].
MDN Web Docs, 2026. Window: confirm() method. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm> [Accessed 10 October 2026].
MDN Web Docs, 2026. Intl.NumberFormat. [online] Available at: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat> [Accessed 10 October 2026].
*/