
import React, { useEffect, useState } from "react";
import {
    UserRound,
    MapPin,
    BriefcaseBusiness,
    Globe,
    Plus,
    X,
    Save,
    LoaderCircle,
    CheckCircle,
    AlertCircle,
    Code2,
    Settings,
    ShieldCheck,
    Bell,
    CircleHelp,
    LogOut
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import FreelancerHeader from "../components/FreelancerHeader";
import {
    fetchMyProfile,
    updateMyProfile
} from "../services/api";

import "../styles/FreelancerProfile.css";

const FreelancerProfile = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const [professionalTitle, setProfessionalTitle] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");

    const [website, setWebsite] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetchMyProfile();

                if (!response?.user) {
                    throw new Error("Unable to retrieve your profile.");
                }

                const user = response.user;

                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setEmail(user.email || "");
                setUsername(user.username || "");

                setProfessionalTitle(user.professionalTitle || "");
                setLocation(user.location || "");
                setBio(user.bio || "");
                setSkills(Array.isArray(user.skills) ? user.skills : []);

                setWebsite(user.website || "");
                setLinkedin(user.linkedin || "");
                setGithub(user.github || "");
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load your profile. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");

        if (!firstName.trim() || !lastName.trim()) {
            setError("Please enter your first and last name.");
            return;
        }

        if (bio.length > 1000) {
            setError("Your bio cannot exceed 1000 characters.");
            return;
        }

        try {
            setSaving(true);

            const response = await updateMyProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                username: username.trim(),
                professionalTitle: professionalTitle.trim(),
                location: location.trim(),
                bio: bio.trim(),
                skills,
                website: website.trim(),
                linkedin: linkedin.trim(),
                github: github.trim()
            });

            if (!response?.user) {
                throw new Error("The server did not return your updated profile.");
            }

            const user = response.user;

            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setUsername(user.username || "");

            setProfessionalTitle(user.professionalTitle || "");
            setLocation(user.location || "");
            setBio(user.bio || "");
            setSkills(Array.isArray(user.skills) ? user.skills : []);

            setWebsite(user.website || "");
            setLinkedin(user.linkedin || "");
            setGithub(user.github || "");

            setSuccessMessage(
                response.message || "Profile updated successfully."
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to save your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = (event) => {
        event.preventDefault();

        const newSkill = skillInput.trim();

        if (!newSkill) return;

        if (
            skills.some(
                (skill) => skill.toLowerCase() === newSkill.toLowerCase()
            )
        ) {
            setError("This skill has already been added.");
            return;
        }

        setSkills((currentSkills) => [...currentSkills, newSkill]);
        setSkillInput("");
        setError("");
        setSuccessMessage("");
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills((currentSkills) =>
            currentSkills.filter((skill) => skill !== skillToRemove)
        );
        setSuccessMessage("");
    };

    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "F";

    const settingsNavigation = [
        {
            label: "Profile",
            icon: UserRound,
            to: "/freelancer/profile",
            active: true
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
            to: "/freelancer/help"
        }
    ];

    return (
        <div className="freelancer-dashboard">
            <FreelancerHeader />

            <div className="freelancer-dashboard-content">
                <div className="freelancer-welcome fp-welcome">
                    <p className="freelancer-eyebrow">Settings</p>
                    <h1>My Profile</h1>
                    <p>
                        Manage your personal information and professional
                        details.
                    </p>
                </div>

                <div className="fp-settings-layout">
                    {/* Settings sidebar */}
                    <aside className="freelancer-panel fp-settings-sidebar">
                        <ul className="fp-settings-nav">
                            {settingsNavigation.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <li key={item.label}>
                                        <Link
                                            to={item.to}
                                            className={
                                                item.active
                                                    ? "fp-settings-link active"
                                                    : "fp-settings-link"
                                            }
                                        >
                                            <Icon size={16} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}

                            <li>
                                <button
                                    type="button"
                                    className="fp-settings-link fp-logout-link"
                                    onClick={() => navigate("/logout")}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </aside>

                    {/* Main profile content */}
                    <main className="fp-main">
                        {error && (
                            <div className="fp-notice fp-error-notice" role="alert">
                                <span>
                                    <AlertCircle size={17} />
                                    {error}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                    aria-label="Dismiss error"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {successMessage && (
                            <div className="fp-notice" role="status">
                                <span>
                                    <CheckCircle size={17} />
                                    {successMessage}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSuccessMessage("")}
                                    aria-label="Dismiss notification"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <section className="freelancer-panel fp-panel fp-loading">
                                <LoaderCircle
                                    size={22}
                                    className="fp-loading-icon"
                                />
                                <p>Loading your profile...</p>
                            </section>
                        ) : (
                            <form
                                className="fp-form"
                                onSubmit={handleSaveProfile}
                            >
                                {/* Profile summary */}
                                <section className="freelancer-panel fp-profile-card">
                                    <div className="fp-profile-summary">
                                        <div className="fp-avatar">
                                            {initials}
                                        </div>

                                        <div className="fp-profile-summary-info">
                                            <h2>
                                                {`${firstName} ${lastName}`.trim() ||
                                                    "Your Name"}
                                            </h2>
                                            <p>
                                                {professionalTitle ||
                                                    "Add your professional title"}
                                            </p>

                                            {location && (
                                                <span className="fp-location">
                                                    <MapPin size={14} />
                                                    {location}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="fp-secondary-button"
                                            onClick={() =>
                                                document
                                                    .getElementById("fp-firstName")
                                                    ?.focus()
                                            }
                                        >
                                            <UserRound size={15} />
                                            Edit Details
                                        </button>
                                    </div>

                                    <p className="fp-photo-hint">
                                        Your initials are generated from your
                                        name. Profile photo uploading can be
                                        added separately.
                                    </p>
                                </section>

                                {/* Personal information */}
                                <section className="freelancer-panel fp-panel">
                                    <div className="fp-panel-heading">
                                        <div>
                                            <h2>Personal Information</h2>
                                            <p>
                                                Keep your account details
                                                accurate and up to date.
                                            </p>
                                        </div>
                                        <UserRound size={21} />
                                    </div>

                                    <div className="fp-grid">
                                        <div className="fp-field">
                                            <label htmlFor="fp-firstName">
                                                First Name *
                                            </label>
                                            <input
                                                id="fp-firstName"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                                autoComplete="given-name"
                                                required
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-lastName">
                                                Last Name *
                                            </label>
                                            <input
                                                id="fp-lastName"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                                autoComplete="family-name"
                                                required
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-email">
                                                Email Address
                                            </label>
                                            <input
                                                id="fp-email"
                                                type="email"
                                                value={email}
                                                readOnly
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-username">
                                                Username
                                            </label>
                                            <input
                                                id="fp-username"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                autoComplete="username"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Professional information */}
                                <section className="freelancer-panel fp-panel">
                                    <div className="fp-panel-heading">
                                        <div>
                                            <h2>Professional Information</h2>
                                            <p>
                                                Tell clients about your
                                                experience and expertise.
                                            </p>
                                        </div>
                                        <BriefcaseBusiness size={21} />
                                    </div>

                                    <div className="fp-grid">
                                        <div className="fp-field">
                                            <label htmlFor="fp-title">
                                                Professional Title
                                            </label>
                                            <input
                                                id="fp-title"
                                                value={professionalTitle}
                                                onChange={(e) =>
                                                    setProfessionalTitle(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. Web Developer"
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-location">
                                                <MapPin size={14} />
                                                Location
                                            </label>
                                            <input
                                                id="fp-location"
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                                placeholder="e.g. Pretoria, South Africa"
                                            />
                                        </div>

                                        <div className="fp-field fp-full-width">
                                            <label htmlFor="fp-bio">
                                                About Me
                                            </label>
                                            <textarea
                                                id="fp-bio"
                                                value={bio}
                                                onChange={(e) =>
                                                    setBio(e.target.value)
                                                }
                                                maxLength={1000}
                                                placeholder="Describe your experience and the services you offer..."
                                            />
                                            <span className="fp-character-count">
                                                {bio.length}/1000 characters
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                {/* Skills */}
                                <section className="freelancer-panel fp-panel">
                                    <div className="fp-panel-heading">
                                        <div>
                                            <h2>Skills & Expertise</h2>
                                            <p>
                                                Add the skills you offer to
                                                potential clients.
                                            </p>
                                        </div>
                                        <Code2 size={21} />
                                    </div>

                                    <div className="fp-skill-input">
                                        <input
                                            value={skillInput}
                                            onChange={(e) =>
                                                setSkillInput(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleAddSkill(e);
                                                }
                                            }}
                                            placeholder="e.g. React, Java, UI/UX Design"
                                            aria-label="Enter a skill"
                                        />
                                        <button
                                            type="button"
                                            className="fp-secondary-button"
                                            onClick={handleAddSkill}
                                        >
                                            <Plus size={16} />
                                            Add Skill
                                        </button>
                                    </div>

                                    <div className="fp-skills">
                                        {skills.length ? (
                                            skills.map((skill) => (
                                                <span
                                                    className="fp-skill-tag"
                                                    key={skill}
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveSkill(skill)
                                                        }
                                                        aria-label={`Remove ${skill}`}
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <p className="fp-empty-skills">
                                                No skills added yet.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                {/* Online presence */}
                                <section className="freelancer-panel fp-panel">
                                    <div className="fp-panel-heading">
                                        <div>
                                            <h2>Online Presence</h2>
                                            <p>
                                                Share your website and
                                                professional accounts.
                                            </p>
                                        </div>
                                        <Globe size={21} />
                                    </div>

                                    <div className="fp-grid">
                                        <div className="fp-field fp-full-width">
                                            <label htmlFor="fp-website">
                                                <Globe size={14} />
                                                Personal Website
                                            </label>
                                            <input
                                                id="fp-website"
                                                type="url"
                                                value={website}
                                                onChange={(e) =>
                                                    setWebsite(e.target.value)
                                                }
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-linkedin">
                                                <Globe size={14} />
                                                LinkedIn Profile
                                            </label>
                                            <input
                                                id="fp-linkedin"
                                                type="url"
                                                value={linkedin}
                                                onChange={(e) =>
                                                    setLinkedin(e.target.value)
                                                }
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>

                                        <div className="fp-field">
                                            <label htmlFor="fp-github">
                                                <Code2 size={14} />
                                                GitHub Profile
                                            </label>
                                            <input
                                                id="fp-github"
                                                type="url"
                                                value={github}
                                                onChange={(e) =>
                                                    setGithub(e.target.value)
                                                }
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="fp-actions">
                                    <button
                                        type="button"
                                        className="fp-secondary-button"
                                        disabled={saving}
                                        onClick={() => window.location.reload()}
                                    >
                                        Cancel Changes
                                    </button>

                                    <button
                                        type="submit"
                                        className="fp-primary-button"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderCircle
                                                    size={16}
                                                    className="fp-loading-icon"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} />
                                                Save Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfile;
