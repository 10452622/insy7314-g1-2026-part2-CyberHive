
import React, { useState } from "react";
import {
    UserRound,
    Settings,
    ShieldCheck,
    Bell,
    CircleHelp,
    LogOut,
    ChevronRight,
    LockKeyhole,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    LoaderCircle,
    Monitor,
    Smartphone,
    Clock3,
    KeyRound,
    ShieldAlert,
    X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/FreelancerSecurity.css";

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

const FreelancerSecurity = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Password requirements for immediate feedback.
    const passwordChecks = [
        {
            label: "At least 8 characters",
            passed: newPassword.length >= 8
        },
        {
            label: "An uppercase letter",
            passed: /[A-Z]/.test(newPassword)
        },
        {
            label: "A lowercase letter",
            passed: /[a-z]/.test(newPassword)
        },
        {
            label: "A number",
            passed: /[0-9]/.test(newPassword)
        },
        {
            label: "A special character",
            passed: /[^A-Za-z0-9]/.test(newPassword)
        }
    ];

    const passedChecks = passwordChecks.filter(
        (check) => check.passed
    ).length;

    const passwordStrength = !newPassword
        ? ""
        : passedChecks <= 2
            ? "Weak"
            : passedChecks <= 4
                ? "Fair"
                : "Strong";

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        clearMessages();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please complete all password fields.");
            return;
        }

        if (newPassword.length < 8) {
            setError(
                "Your new password must contain at least 8 characters."
            );
            return;
        }

        if (newPassword === currentPassword) {
            setError(
                "Your new password must be different from your current password."
            );
            return;
        }

        if (passedChecks < 5) {
            setError(
                "Please meet all the password requirements before continuing."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Your new passwords do not match.");
            return;
        }

        /*
         * BACKEND INTEGRATION REQUIRED:
         *
         * Connect this handler to your authenticated password-change API.
         * The endpoint should verify the current password, hash the new
         * password, and return a success or error response.
         *
         * Do not show a success message until the API confirms the change.
         */

        setError(
            "Password changes are not connected yet. Connect your password-update API to enable this feature."
        );
    };

    const handleLogout = () => {
        navigate("/logout");
    };

    return (
        <div className="fsec-page">
            {/* Shared header used throughout the freelancer dashboard */}
            <FreelancerHeader />

            <div className="freelancer-dashboard-content fsec-content">
                {/* Page heading */}
                <header className="fsec-heading">
                    <p className="fsec-eyebrow">SETTINGS</p>
                    <h1>Security</h1>
                    <p>
                        Protect your account, manage your password, and
                        keep your information secure.
                    </p>
                </header>

                {/* Feedback messages */}
                {error && (
                    <div
                        className="fsec-notice fsec-error-notice"
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
                        className="fsec-notice fsec-success-notice"
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

                <div className="fsec-settings-layout">
                    {/* Consistent settings navigation */}
                    <aside className="fsec-settings-sidebar">
                        <h2>Settings</h2>

                        <nav aria-label="Freelancer settings navigation">
                            {settingsNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.to === "/freelancer/security";

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={
                                            isActive
                                                ? "fsec-settings-nav-item is-active"
                                                : "fsec-settings-nav-item"
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
                                            className="fsec-nav-chevron"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                className="fsec-settings-nav-item fsec-logout-item"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} aria-hidden="true" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main security content */}
                    <main className="fsec-settings-main">
                        {/* Security overview */}
                        <section className="fsec-security-banner">
                            <div className="fsec-security-banner-icon">
                                <ShieldCheck
                                    size={25}
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <h2>Keep your account protected</h2>
                                <p>
                                    Use a strong, unique password and never
                                    share your login details with anyone.
                                </p>
                            </div>

                            <span className="fsec-status-badge">
                                <LockKeyhole size={13} />
                                Account security
                            </span>
                        </section>

                        {/* Password form */}
                        <section className="fsec-panel">
                            <div className="fsec-panel-heading">
                                <div>
                                    <h2>Change Password</h2>
                                    <p>
                                        Update your password to help keep your
                                        freelancer account secure.
                                    </p>
                                </div>

                                <span className="fsec-heading-icon">
                                    <KeyRound size={20} />
                                </span>
                            </div>

                            <form
                                className="fsec-password-form"
                                onSubmit={handlePasswordChange}
                            >
                                {/* Current password */}
                                <div className="fsec-field">
                                    <label htmlFor="fsec-current-password">
                                        Current Password
                                    </label>

                                    <div className="fsec-password-input">
                                        <input
                                            id="fsec-current-password"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={currentPassword}
                                            onChange={(event) => {
                                                setCurrentPassword(
                                                    event.target.value
                                                );
                                                clearMessages();
                                            }}
                                            autoComplete="current-password"
                                            placeholder="Enter your current password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (visible) => !visible
                                                )
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Hide current password"
                                                    : "Show current password"
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New password */}
                                <div className="fsec-field">
                                    <label htmlFor="fsec-new-password">
                                        New Password
                                    </label>

                                    <div className="fsec-password-input">
                                        <input
                                            id="fsec-new-password"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={newPassword}
                                            onChange={(event) => {
                                                setNewPassword(
                                                    event.target.value
                                                );
                                                clearMessages();
                                            }}
                                            autoComplete="new-password"
                                            placeholder="Create a strong password"
                                            minLength={8}
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (visible) => !visible
                                                )
                                            }
                                            aria-label={
                                                showNewPassword
                                                    ? "Hide new password"
                                                    : "Show new password"
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password strength */}
                                    {newPassword && (
                                        <div className="fsec-strength">
                                            <div
                                                className="fsec-strength-bars"
                                                aria-label={`Password strength: ${passwordStrength}`}
                                            >
                                                {passwordChecks.map(
                                                    (check, index) => (
                                                        <span
                                                            key={check.label}
                                                            className={
                                                                index <
                                                                passedChecks
                                                                    ? `is-filled strength-${passwordStrength.toLowerCase()}`
                                                                    : ""
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>

                                            <span
                                                className={`fsec-strength-label strength-${passwordStrength.toLowerCase()}`}
                                            >
                                                {passwordStrength} password
                                            </span>
                                        </div>
                                    )}

                                    <div className="fsec-password-requirements">
                                        <p>Password requirements</p>

                                        <ul>
                                            {passwordChecks.map((check) => (
                                                <li
                                                    key={check.label}
                                                    className={
                                                        check.passed
                                                            ? "is-passed"
                                                            : ""
                                                    }
                                                >
                                                    <CheckCircle
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    <span>{check.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Confirm password */}
                                <div className="fsec-field">
                                    <label htmlFor="fsec-confirm-password">
                                        Confirm New Password
                                    </label>

                                    <div className="fsec-password-input">
                                        <input
                                            id="fsec-confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmPassword}
                                            onChange={(event) => {
                                                setConfirmPassword(
                                                    event.target.value
                                                );
                                                clearMessages();
                                            }}
                                            autoComplete="new-password"
                                            placeholder="Re-enter your new password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (visible) => !visible
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirmation password"
                                                    : "Show confirmation password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>

                                    {confirmPassword && (
                                        <p
                                            className={
                                                newPassword === confirmPassword
                                                    ? "fsec-match fsec-match-success"
                                                    : "fsec-match fsec-match-error"
                                            }
                                        >
                                            {newPassword === confirmPassword
                                                ? "Passwords match."
                                                : "Passwords do not match."}
                                        </p>
                                    )}
                                </div>

                                <div className="fsec-password-tip">
                                    <ShieldAlert
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    <p>
                                        Never reuse a password from another
                                        website. A password manager can help
                                        you create and store unique passwords.
                                    </p>
                                </div>

                                <div className="fsec-form-actions">
                                    <button
                                        type="button"
                                        className="fsec-secondary-button"
                                        disabled={saving}
                                        onClick={() => {
                                            setCurrentPassword("");
                                            setNewPassword("");
                                            setConfirmPassword("");
                                            clearMessages();
                                        }}
                                    >
                                        Clear Fields
                                    </button>

                                    <button
                                        type="submit"
                                        className="fsec-primary-button"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderCircle
                                                    size={16}
                                                    className="fsec-spin"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <LockKeyhole size={16} />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Login activity */}
                        <section className="fsec-panel">
                            <div className="fsec-panel-heading">
                                <div>
                                    <h2>Login Activity</h2>
                                    <p>
                                        Learn what information to review when
                                        checking access to your account.
                                    </p>
                                </div>

                                <span className="fsec-heading-icon">
                                    <Clock3 size={20} />
                                </span>
                            </div>

                            <div className="fsec-activity-content">
                                <div className="fsec-activity-row">
                                    <span className="fsec-activity-icon">
                                        <Monitor size={19} />
                                    </span>

                                    <div className="fsec-activity-details">
                                        <h3>Web browser sessions</h3>
                                        <p>
                                            Review the devices and browser
                                            sessions associated with your
                                            account.
                                        </p>
                                    </div>

                                    <span className="fsec-activity-label">
                                        API required
                                    </span>
                                </div>

                                <div className="fsec-activity-row">
                                    <span className="fsec-activity-icon">
                                        <Smartphone size={19} />
                                    </span>

                                    <div className="fsec-activity-details">
                                        <h3>Mobile sessions</h3>
                                        <p>
                                            Check for unfamiliar mobile
                                            devices or sign-in activity.
                                        </p>
                                    </div>

                                    <span className="fsec-activity-label">
                                        API required
                                    </span>
                                </div>

                                <div className="fsec-activity-note">
                                    <AlertCircle
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    <p>
                                        Live login history is not available
                                        until session tracking is connected
                                        to the backend.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Account protection */}
                        <section className="fsec-panel">
                            <div className="fsec-panel-heading">
                                <div>
                                    <h2>Account Protection</h2>
                                    <p>
                                        Recommended steps to help protect your
                                        account.
                                    </p>
                                </div>

                                <span className="fsec-heading-icon">
                                    <ShieldCheck size={20} />
                                </span>
                            </div>

                            <div className="fsec-protection-list">
                                <div className="fsec-protection-item">
                                    <span className="fsec-protection-check">
                                        <CheckCircle size={17} />
                                    </span>

                                    <div>
                                        <h3>Use a unique password</h3>
                                        <p>
                                            Choose a password that you do not
                                            use on other websites.
                                        </p>
                                    </div>
                                </div>

                                <div className="fsec-protection-item">
                                    <span className="fsec-protection-check">
                                        <CheckCircle size={17} />
                                    </span>

                                    <div>
                                        <h3>Keep your device secure</h3>
                                        <p>
                                            Lock your devices and sign out
                                            when using a shared computer.
                                        </p>
                                    </div>
                                </div>

                                <div className="fsec-protection-item">
                                    <span className="fsec-protection-check">
                                        <CheckCircle size={17} />
                                    </span>

                                    <div>
                                        <h3>Watch for suspicious activity</h3>
                                        <p>
                                            Contact support if you notice
                                            unfamiliar activity on your
                                            account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FreelancerSecurity;
