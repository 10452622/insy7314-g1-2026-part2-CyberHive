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
    LogOut,
    ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import FreelancerHeader from "../components/FreelancerHeader";
import {
    fetchMyProfile,
    updateMyProfile
} from "../services/api";

import "../styles/FreelancerProfile.css";

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

    const applyProfile = (user) => {
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
    };

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetchMyProfile();

                if (!response?.user) {
                    throw new Error("Unable to retrieve your profile.");
                }

                if (isMounted) {
                    applyProfile(response.user);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err.message ||
                        "Unable to load your profile. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
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

            const profileData = {
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
            };

            const response = await updateMyProfile(profileData);

            if (!response?.user) {
                throw new Error(
                    "The server did not return your updated profile."
                );
            }

            applyProfile(response.user);

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

        if (!newSkill) {
            return;
        }

        const alreadyExists = skills.some(
            (skill) => skill.toLowerCase() === newSkill.toLowerCase()
        );

        if (alreadyExists) {
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

    const handleCancelChanges = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setSkillInput("");
            setLoading(true);

            const response = await fetchMyProfile();

            if (!response?.user) {
                throw new Error("Unable to reload your saved profile.");
            }

            applyProfile(response.user);
        } catch (err) {
            setError(
                err.message ||
                "Unable to reload your saved profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "F";

    const handleLogout = () => {
        navigate("/logout");
    };

    return (
        <div className="fps-page">
            {/* Shared freelancer header */}
            <FreelancerHeader />

            <div className="freelancer-dashboard-content fps-content">
                {/* Page heading */}
                <header className="fps-heading">
                    <p className="fps-eyebrow">SETTINGS</p>
                    <h1>My Profile</h1>
                    <p>
                        Manage your personal information and professional
                        details.
                    </p>
                </header>

                {/* Feedback messages */}
                {error && (
                    <div
                        className="fps-notice fps-error-notice"
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
                        className="fps-notice fps-success-notice"
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

                <div className="fps-settings-layout">
                    {/* Settings sidebar */}
                    <aside className="fps-settings-sidebar">
                        <h2>Settings</h2>

                        <nav aria-label="Freelancer settings navigation">
                            {settingsNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.to === "/freelancer/profile";

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={
                                            isActive
                                                ? "fps-settings-nav-item is-active"
                                                : "fps-settings-nav-item"
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
                                            className="fps-nav-chevron"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                className="fps-settings-nav-item fps-logout-item"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} aria-hidden="true" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    {/* Main profile content */}
                    <main className="fps-settings-main">
                        {loading ? (
                            <div className="fps-loading">
                                <LoaderCircle
                                    size={24}
                                    className="fps-loading-icon"
                                    aria-hidden="true"
                                />
                                <p>Loading your profile...</p>
                            </div>
                        ) : (
                            <form
                                className="fps-profile-form"
                                onSubmit={handleSaveProfile}
                            >
                                {/* Profile summary */}
                                <section className="fps-profile-summary">
                                    <div className="fps-avatar">
                                        {initials}
                                    </div>

                                    <div className="fps-profile-summary-info">
                                        <h2>
                                            {`${firstName} ${lastName}`.trim() ||
                                                "Your Name"}
                                        </h2>

                                        <p>
                                            {professionalTitle ||
                                                "Add your professional title"}
                                        </p>

                                        {location && (
                                            <span className="fps-profile-location">
                                                <MapPin
                                                    size={14}
                                                    aria-hidden="true"
                                                />
                                                {location}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className="fps-secondary-button"
                                        onClick={() =>
                                            document
                                                .getElementById("fps-firstName")
                                                ?.focus()
                                        }
                                    >
                                        <UserRound size={15} />
                                        Edit Details
                                    </button>
                                </section>

                                <p className="fps-photo-hint">
                                    Your initials are generated from your
                                    name. Profile photo uploading can be
                                    added separately.
                                </p>

                                {/* Personal information */}
                                <section className="fps-profile-section">
                                    <div className="fps-panel-heading">
                                        <div>
                                            <h2>Personal Information</h2>
                                            <p>
                                                Keep your account details
                                                accurate and up to date.
                                            </p>
                                        </div>

                                        <span className="fps-heading-icon">
                                            <UserRound size={20} />
                                        </span>
                                    </div>

                                    <div className="fps-section-body">
                                        <div className="fps-grid">
                                            <div className="fps-form-group">
                                                <label htmlFor="fps-firstName">
                                                    First Name *
                                                </label>
                                                <input
                                                    id="fps-firstName"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(event) =>
                                                        setFirstName(
                                                            event.target.value
                                                        )
                                                    }
                                                    autoComplete="given-name"
                                                    required
                                                />
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-lastName">
                                                    Last Name *
                                                </label>
                                                <input
                                                    id="fps-lastName"
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(event) =>
                                                        setLastName(
                                                            event.target.value
                                                        )
                                                    }
                                                    autoComplete="family-name"
                                                    required
                                                />
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-email">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="fps-email"
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    autoComplete="email"
                                                />
                                                <small>
                                                    Contact support if you need
                                                    to change your email.
                                                </small>
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-username">
                                                    Username
                                                </label>
                                                <input
                                                    id="fps-username"
                                                    type="text"
                                                    value={username}
                                                    onChange={(event) =>
                                                        setUsername(
                                                            event.target.value
                                                        )
                                                    }
                                                    autoComplete="username"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Professional information */}
                                <section className="fps-profile-section">
                                    <div className="fps-panel-heading">
                                        <div>
                                            <h2>Professional Information</h2>
                                            <p>
                                                Tell clients about your
                                                experience and expertise.
                                            </p>
                                        </div>

                                        <span className="fps-heading-icon">
                                            <BriefcaseBusiness size={20} />
                                        </span>
                                    </div>

                                    <div className="fps-section-body">
                                        <div className="fps-grid">
                                            <div className="fps-form-group">
                                                <label htmlFor="fps-title">
                                                    Professional Title
                                                </label>
                                                <input
                                                    id="fps-title"
                                                    type="text"
                                                    value={professionalTitle}
                                                    onChange={(event) =>
                                                        setProfessionalTitle(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Web Developer"
                                                />
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-location">
                                                    <MapPin
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    Location
                                                </label>
                                                <input
                                                    id="fps-location"
                                                    type="text"
                                                    value={location}
                                                    onChange={(event) =>
                                                        setLocation(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Pretoria, South Africa"
                                                />
                                            </div>

                                            <div className="fps-form-group fps-full-width">
                                                <label htmlFor="fps-bio">
                                                    About Me
                                                </label>
                                                <textarea
                                                    id="fps-bio"
                                                    value={bio}
                                                    onChange={(event) =>
                                                        setBio(
                                                            event.target.value
                                                        )
                                                    }
                                                    maxLength={1000}
                                                    rows={5}
                                                    placeholder="Describe your experience and the services you offer..."
                                                />
                                                <span className="fps-character-count">
                                                    {bio.length}/1000 characters
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Skills */}
                                <section className="fps-profile-section">
                                    <div className="fps-panel-heading">
                                        <div>
                                            <h2>Skills & Expertise</h2>
                                            <p>
                                                Add the skills you offer to
                                                potential clients.
                                            </p>
                                        </div>

                                        <span className="fps-heading-icon">
                                            <Code2 size={20} />
                                        </span>
                                    </div>

                                    <div className="fps-section-body">
                                        <div className="fps-skill-input">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(event) =>
                                                    setSkillInput(
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        handleAddSkill(event);
                                                    }
                                                }}
                                                placeholder="e.g. React, Java, UI/UX Design"
                                                aria-label="Enter a skill"
                                            />

                                            <button
                                                type="button"
                                                className="fps-secondary-button"
                                                onClick={handleAddSkill}
                                            >
                                                <Plus size={16} />
                                                Add Skill
                                            </button>
                                        </div>

                                        <div className="fps-skills">
                                            {skills.length > 0 ? (
                                                skills.map((skill) => (
                                                    <span
                                                        className="fps-skill-tag"
                                                        key={skill}
                                                    >
                                                        {skill}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveSkill(
                                                                    skill
                                                                )
                                                            }
                                                            aria-label={`Remove ${skill}`}
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="fps-empty-skills">
                                                    No skills added yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Online presence */}
                                <section className="fps-profile-section">
                                    <div className="fps-panel-heading">
                                        <div>
                                            <h2>Online Presence</h2>
                                            <p>
                                                Share your website and
                                                professional accounts.
                                            </p>
                                        </div>

                                        <span className="fps-heading-icon">
                                            <Globe size={20} />
                                        </span>
                                    </div>

                                    <div className="fps-section-body">
                                        <div className="fps-grid">
                                            <div className="fps-form-group fps-full-width">
                                                <label htmlFor="fps-website">
                                                    <Globe
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    Personal Website
                                                </label>
                                                <input
                                                    id="fps-website"
                                                    type="url"
                                                    value={website}
                                                    onChange={(event) =>
                                                        setWebsite(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-linkedin">
                                                    <Globe
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    LinkedIn Profile
                                                </label>
                                                <input
                                                    id="fps-linkedin"
                                                    type="url"
                                                    value={linkedin}
                                                    onChange={(event) =>
                                                        setLinkedin(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>

                                            <div className="fps-form-group">
                                                <label htmlFor="fps-github">
                                                    <Code2
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                    GitHub Profile
                                                </label>
                                                <input
                                                    id="fps-github"
                                                    type="url"
                                                    value={github}
                                                    onChange={(event) =>
                                                        setGithub(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://github.com/username"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Form actions */}
                                <div className="fps-form-actions">
                                    <button
                                        type="button"
                                        className="fps-secondary-button"
                                        onClick={handleCancelChanges}
                                        disabled={saving || loading}
                                    >
                                        Cancel Changes
                                    </button>

                                    <button
                                        type="submit"
                                        className="fps-primary-button"
                                        disabled={saving || loading}
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderCircle
                                                    size={16}
                                                    className="fps-loading-icon"
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
