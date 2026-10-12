import React, { useState } from "react";
import {
    UserRound,
    Settings,
    ShieldCheck,
    Bell,
    CircleHelp,
    LogOut,
    ChevronRight,
    Mail,
    Smartphone,
    BellRing,
    BriefcaseBusiness,
    MessageSquare,
    CreditCard,
    Megaphone,
    CalendarClock,
    CheckCircle,
    AlertCircle,
    LoaderCircle,
    Save,
    RotateCcw,
    Info,
    X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/FreelancerNotifications.css";

const settingsNavigation = [
    {
        label: "Profile",
        icon: UserRound,
        to: "/freelancer/profile"
    },
    {
        label: "Account Settings",
        icon: Settings,
        to: "/freelancer/account-settings"
    },
    {
        label: "Security",
        icon: ShieldCheck,
        to: "/freelancer/security"
    },
    {
        label: "Notifications",
        icon: Bell,
        to: "/freelancer/notifications"
    },
    {
        label: "Help & Support",
        icon: CircleHelp,
        to: "/freelancer/support"
    }
];

const defaultPreferences = {
    email: true,
    push: true,
    sms: false,
    newOrders: true,
    orderUpdates: true,
    paymentUpdates: true,
    accountActivity: true,
    reminders: true,
    promotions: false
};

const deliveryChannels = [
    {
        key: "email",
        title: "Email Notifications",
        description:
            "Receive important updates and notifications in your email inbox.",
        icon: Mail
    },
    {
        key: "push",
        title: "Push Notifications",
        description:
            "Receive browser or device notifications when updates are available.",
        icon: BellRing
    },
    {
        key: "sms",
        title: "SMS Notifications",
        description:
            "Receive selected notifications by SMS when a supported phone number is linked.",
        icon: Smartphone
    }
];

const notificationTypes = [
    {
        key: "newOrders",
        title: "New Orders & Opportunities",
        description:
            "Get notified when clients place orders or new work opportunities become available.",
        icon: BriefcaseBusiness
    },
    {
        key: "orderUpdates",
        title: "Order Updates",
        description:
            "Stay informed about order progress, deadlines, cancellations, and completion.",
        icon: MessageSquare
    },
    {
        key: "paymentUpdates",
        title: "Payments & Earnings",
        description:
            "Receive updates about payments, transactions, and your freelancer earnings.",
        icon: CreditCard
    },
    {
        key: "accountActivity",
        title: "Account & Security Activity",
        description:
            "Receive important updates about account activity and security-related changes.",
        icon: ShieldCheck
    },
    {
        key: "reminders",
        title: "Reminders & Deadlines",
        description:
            "Get reminders about upcoming deadlines and outstanding tasks.",
        icon: CalendarClock
    },
    {
        key: "promotions",
        title: "News & Promotions",
        description:
            "Hear about HustleHub+ announcements, product updates, and promotional offers.",
        icon: Megaphone
    }
];

const FreelancerNotifications = () => {
    const navigate = useNavigate();

    const [preferences, setPreferences] = useState({
        ...defaultPreferences
    });

    const [savedPreferences, setSavedPreferences] = useState({
        ...defaultPreferences
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const hasChanges =
        JSON.stringify(preferences) !==
        JSON.stringify(savedPreferences);

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const handleToggle = (key) => {
        setPreferences((current) => ({
            ...current,
            [key]: !current[key]
        }));

        clearMessages();
    };

    const handleSave = async (event) => {
        event.preventDefault();
        clearMessages();

        if (!hasChanges || saving) {
            return;
        }

        /*
         * BACKEND INTEGRATION REQUIRED:
         *
         * Connect this handler to your notification preferences API.
         * The backend should save the preferences for the authenticated
         * freelancer and return the updated settings.
         *
         * Do not treat frontend state as permanently saved preferences.
         */

        setError(
            "Notification preferences are not connected to the backend yet. Connect your notification settings API to save these changes permanently."
        );
    };

    const handleDiscard = () => {
        setPreferences({ ...savedPreferences });
        clearMessages();
    };

    const handleRestoreDefaults = () => {
        setPreferences({ ...defaultPreferences });
        clearMessages();
    };

    const handleLogout = () => {
        navigate("/logout");
    };

    const Toggle = ({ checked, onChange, label }) => (
        <button
            type="button"
            className={`fns-toggle ${checked ? "is-active" : ""}`}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
        >
            <span className="fns-toggle-knob" />
        </button>
    );

    const renderPreferenceRows = (items) =>
        items.map((item) => {
            const Icon = item.icon;

            return (
                <div className="fns-preference-row" key={item.key}>
                    <div className="fns-preference-icon">
                        <Icon size={18} aria-hidden="true" />
                    </div>

                    <div className="fns-preference-details">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>

                    <Toggle
                        checked={preferences[item.key]}
                        onChange={() => handleToggle(item.key)}
                        label={item.title}
                    />
                </div>
            );
        });

    return (
        <div className="fns-page">
            {/* Shared freelancer dashboard header */}
            <FreelancerHeader />

            <div className="freelancer-dashboard-content fns-content">
                {/* Page heading - consistent with Security */}
                <header className="fns-heading">
                    <p className="fns-eyebrow">SETTINGS</p>
                    <h1>Notifications</h1>
                    <p>
                        Manage your notification preferences and choose
                        how you stay updated on your freelance activity.
                    </p>
                </header>

                {/* Feedback messages */}
                {error && (
                    <div
                        className="fns-notice fns-error-notice"
                        role="alert"
                    >
                        <AlertCircle size={17} aria-hidden="true" />

                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {successMessage && (
                    <div
                        className="fns-notice fns-success-notice"
                        role="status"
                    >
                        <CheckCircle size={17} aria-hidden="true" />

                        <span>{successMessage}</span>

                        <button
                            type="button"
                            onClick={() => setSuccessMessage("")}
                            aria-label="Dismiss success message"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="fns-settings-layout">
                    {/* Consistent settings navigation */}
                    <aside className="fns-settings-sidebar">
                        <h2>Settings</h2>

                        <nav aria-label="Freelancer settings navigation">
                            {settingsNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.to === "/freelancer/notifications";

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={
                                            isActive
                                                ? "fns-settings-nav-item is-active"
                                                : "fns-settings-nav-item"
                                        }
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                    >
                                        <Icon
                                            size={16}
                                            aria-hidden="true"
                                        />

                                        <span>{item.label}</span>

                                        <ChevronRight
                                            size={15}
                                            className="fns-nav-chevron"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                className="fns-settings-nav-item fns-logout-item"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} aria-hidden="true" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main notifications content */}
                    <main className="fns-settings-main">
                        {/* Notifications overview */}
                        <section className="fns-notification-banner">
                            <div className="fns-banner-icon">
                                <BellRing size={24} aria-hidden="true" />
                            </div>

                            <div className="fns-banner-copy">
                                <h2>Stay in the loop</h2>
                                <p>
                                    Choose the updates you want to receive
                                    and the channels that work best for you.
                                </p>
                            </div>

                            <span className="fns-status-badge">
                                <Bell size={13} aria-hidden="true" />
                                Preferences
                            </span>
                        </section>

                        {/* Delivery channels */}
                        <section className="fns-panel">
                            <div className="fns-panel-heading">
                                <div>
                                    <h2>Delivery Channels</h2>
                                    <p>
                                        Choose where you would like to
                                        receive notifications.
                                    </p>
                                </div>

                                <span className="fns-heading-icon">
                                    <Mail size={20} aria-hidden="true" />
                                </span>
                            </div>

                            <div className="fns-preference-list">
                                {renderPreferenceRows(deliveryChannels)}
                            </div>

                            <div className="fns-information-note">
                                <Info size={17} aria-hidden="true" />
                                <p>
                                    These options set your preferred
                                    notification channels. Actual email,
                                    SMS, and push delivery must be
                                    configured through the backend.
                                </p>
                            </div>
                        </section>

                        {/* Notification categories */}
                        <section className="fns-panel">
                            <div className="fns-panel-heading">
                                <div>
                                    <h2>Notification Preferences</h2>
                                    <p>
                                        Choose which types of updates you
                                        want to receive.
                                    </p>
                                </div>

                                <span className="fns-heading-icon">
                                    <Settings size={20} aria-hidden="true" />
                                </span>
                            </div>

                            <div className="fns-preference-list">
                                {renderPreferenceRows(notificationTypes)}
                            </div>
                        </section>

                        {/* Essential alerts */}
                        <section className="fns-security-note">
                            <div className="fns-security-note-icon">
                                <ShieldCheck size={20} aria-hidden="true" />
                            </div>

                            <div>
                                <h3>Important Account Alerts</h3>
                                <p>
                                    Essential account and security alerts
                                    may still be sent when necessary to
                                    protect your account, even if optional
                                    notification categories are disabled.
                                </p>
                            </div>
                        </section>

                        {/* Save and reset actions */}
                        <form
                            className="fns-form-actions"
                            onSubmit={handleSave}
                        >
                            <button
                                type="button"
                                className="fns-secondary-button"
                                onClick={handleDiscard}
                                disabled={!hasChanges || saving}
                            >
                                <RotateCcw size={16} aria-hidden="true" />
                                Discard Changes
                            </button>

                            <button
                                type="button"
                                className="fns-secondary-button"
                                onClick={handleRestoreDefaults}
                                disabled={saving}
                            >
                                Restore Defaults
                            </button>

                            <button
                                type="submit"
                                className="fns-primary-button"
                                disabled={!hasChanges || saving}
                            >
                                {saving ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="fns-spin"
                                            aria-hidden="true"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} aria-hidden="true" />
                                        Save Preferences
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="fns-footer-note">
                            <Info size={15} aria-hidden="true" />
                            <span>
                                Preferences are currently held in page
                                state and are not persisted after refresh.
                            </span>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FreelancerNotifications;
