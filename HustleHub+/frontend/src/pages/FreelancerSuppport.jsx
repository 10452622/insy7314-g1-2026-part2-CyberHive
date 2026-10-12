import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserRound,
    Settings,
    ShieldCheck,
    Bell,
    CircleHelp,
    LogOut,
    ChevronRight,
    Search,
    MessageCircle,
    BookOpen,
    CreditCard,
    ShoppingBag,
    LockKeyhole,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Send,
    Mail,
    Clock3,
    CheckCircle,
    AlertCircle,
    X,
    ExternalLink
} from "lucide-react";

import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/FreelancerSupport.css";

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

const faqCategories = [
    { label: "All topics", value: "All" },
    { label: "Account", value: "Account" },
    { label: "Orders", value: "Orders" },
    { label: "Payments", value: "Payments" },
    { label: "Security", value: "Security" },
    { label: "General", value: "General" }
];

const faqItems = [
    {
        id: 1,
        category: "Account",
        question: "How do I update my freelancer profile?",
        answer:
            "Open Profile from your settings menu. You can update your name, professional title, location, biography, skills and online links. Save your changes when you are finished."
    },
    {
        id: 2,
        category: "Account",
        question: "What should I do if my email address is incorrect?",
        answer:
            "If your email address cannot be edited from your account settings, contact support for assistance. Never share your password when requesting account help."
    },
    {
        id: 3,
        category: "Orders",
        question: "Where can I check my orders?",
        answer:
            "Open your freelancer dashboard and navigate to the relevant orders or transactions section. Available order details depend on the features enabled for your account."
    },
    {
        id: 4,
        category: "Orders",
        question: "What should I do if there is a problem with an order?",
        answer:
            "Gather the order reference, explain the issue clearly and contact support. Avoid sharing private client information that is not needed to resolve the issue."
    },
    {
        id: 5,
        category: "Payments",
        question: "Where can I view my earnings?",
        answer:
            "Visit the Earnings or Transactions section of your freelancer dashboard to review the financial information available to your account."
    },
    {
        id: 6,
        category: "Payments",
        question: "What if a payment appears to be missing?",
        answer:
            "Check the order status and transaction details first. If the payment is still missing, submit a support request with the relevant order or transaction reference. Do not include card details or passwords."
    },
    {
        id: 7,
        category: "Security",
        question: "How can I keep my account secure?",
        answer:
            "Use a strong, unique password, keep your contact details up to date and enable any additional security options available in your Security settings. Never share verification codes."
    },
    {
        id: 8,
        category: "Security",
        question: "What should I do if I suspect unauthorised access?",
        answer:
            "Change your password as soon as possible, review your security settings and contact support with a description of the suspicious activity. Do not include your password or authentication codes in a support message."
    },
    {
        id: 9,
        category: "General",
        question: "How do I contact HustleHub+ support?",
        answer:
            "Use the support request form on this page to describe your question or problem. The form currently provides client-side validation; a backend support endpoint is still required to send and track requests."
    },
    {
        id: 10,
        category: "General",
        question: "What information should I include in a support request?",
        answer:
            "Include a clear subject, the category of the issue and the steps you have already tried. Include an order reference only when relevant. Never submit passwords, payment card details or authentication codes."
    }
];

const requestCategories = [
    "General question",
    "Account issue",
    "Order or client issue",
    "Payment or earnings",
    "Technical issue",
    "Security concern",
    "Other"
];

const initialForm = {
    name: "",
    email: "",
    category: "General question",
    subject: "",
    message: ""
};

const FreelancerSupport = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [expandedFaq, setExpandedFaq] = useState(1);

    const [formData, setFormData] = useState(initialForm);
    const [formError, setFormError] = useState("");
    const [formNotice, setFormNotice] = useState("");

    const filteredFaqs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return faqItems.filter((faq) => {
            const matchesCategory =
                activeCategory === "All" ||
                faq.category === activeCategory;

            const matchesSearch =
                !query ||
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query) ||
                faq.category.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);

    const handleLogout = () => {
        navigate("/logout");
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setExpandedFaq(null);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setFormError("");
        setFormNotice("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setFormError("");
        setFormNotice("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.subject.trim() ||
            !formData.message.trim()
        ) {
            setFormError("Please complete all required fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email.trim())) {
            setFormError("Please enter a valid email address.");
            return;
        }

        if (formData.subject.trim().length < 3) {
            setFormError("Your subject must contain at least 3 characters.");
            return;
        }

        if (formData.message.trim().length < 10) {
            setFormError(
                "Please provide a little more detail (at least 10 characters)."
            );
            return;
        }

        setFormNotice(
            "Your form has been validated, but your request has not been sent. Connect the support API to submit and track support tickets."
        );
    };

    const handleClearForm = () => {
        setFormData(initialForm);
        setFormError("");
        setFormNotice("");
    };

    return (
        <div className="fss-page">
            <FreelancerHeader />

            <div className="freelancer-dashboard-content fss-content">
                <header className="fss-heading">
                    <p className="fss-eyebrow">SETTINGS</p>
                    <h1>Help &amp; Support</h1>
                    <p>
                        Find answers to common questions or get help with
                        your HustleHub+ account.
                    </p>
                </header>

                {formError && (
                    <div className="fss-notice fss-error-notice" role="alert">
                        <AlertCircle size={17} aria-hidden="true" />
                        <span>{formError}</span>
                        <button
                            type="button"
                            onClick={() => setFormError("")}
                            aria-label="Dismiss error"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {formNotice && (
                    <div
                        className="fss-notice fss-info-notice"
                        role="status"
                    >
                        <CheckCircle size={17} aria-hidden="true" />
                        <span>{formNotice}</span>
                        <button
                            type="button"
                            onClick={() => setFormNotice("")}
                            aria-label="Dismiss message"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="fss-settings-layout">
                    <aside className="fss-settings-sidebar">
                        <h2>Settings</h2>

                        <nav aria-label="Freelancer settings navigation">
                            {settingsNavigation.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    item.to === "/freelancer/support";

                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={
                                            isActive
                                                ? "fss-settings-nav-item is-active"
                                                : "fss-settings-nav-item"
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
                                            className="fss-nav-chevron"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                className="fss-settings-nav-item fss-logout-item"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} aria-hidden="true" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </aside>

                    <main className="fss-settings-main">
                        {/* Support introduction */}
                        <section className="fss-welcome-panel">
                            <div className="fss-welcome-icon">
                                <MessageCircle
                                    size={23}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="fss-welcome-copy">
                                <p className="fss-welcome-label">
                                    WE'RE HERE TO HELP
                                </p>
                                <h2>How can we help you?</h2>
                                <p>
                                    Search our frequently asked questions or
                                    send us a message using the support form.
                                </p>
                            </div>
                        </section>

                        {/* Frequently asked questions */}
                        <section className="fss-panel">
                            <div className="fss-panel-heading">
                                <div>
                                    <h2>Frequently Asked Questions</h2>
                                    <p>
                                        Browse common questions about your
                                        account, orders and payments.
                                    </p>
                                </div>
                                <span className="fss-heading-icon">
                                    <BookOpen
                                        size={20}
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>

                            <div className="fss-faq-body">
                                <label
                                    className="fss-search-box"
                                    htmlFor="fss-faq-search"
                                >
                                    <Search
                                        size={17}
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="fss-faq-search"
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) => {
                                            setSearchTerm(event.target.value);
                                            setExpandedFaq(null);
                                        }}
                                        placeholder="Search for an answer..."
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setExpandedFaq(null);
                                            }}
                                            aria-label="Clear search"
                                        >
                                            <X size={15} />
                                        </button>
                                    )}
                                </label>

                                <div
                                    className="fss-category-filters"
                                    aria-label="Filter FAQs by category"
                                >
                                    {faqCategories.map((category) => (
                                        <button
                                            key={category.value}
                                            type="button"
                                            className={
                                                activeCategory ===
                                                category.value
                                                    ? "fss-category-chip is-active"
                                                    : "fss-category-chip"
                                            }
                                            onClick={() =>
                                                handleCategoryChange(
                                                    category.value
                                                )
                                            }
                                            aria-pressed={
                                                activeCategory ===
                                                category.value
                                            }
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="fss-faq-list">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((faq) => {
                                            const isExpanded =
                                                expandedFaq === faq.id;

                                            return (
                                                <article
                                                    className={
                                                        isExpanded
                                                            ? "fss-faq-item is-expanded"
                                                            : "fss-faq-item"
                                                    }
                                                    key={faq.id}
                                                >
                                                    <button
                                                        type="button"
                                                        className="fss-faq-question"
                                                        onClick={() =>
                                                            setExpandedFaq(
                                                                isExpanded
                                                                    ? null
                                                                    : faq.id
                                                            )
                                                        }
                                                        aria-expanded={
                                                            isExpanded
                                                        }
                                                    >
                                                        <span className="fss-faq-question-copy">
                                                            <span className="fss-faq-category">
                                                                {faq.category}
                                                            </span>
                                                            <span className="fss-faq-question-text">
                                                                {faq.question}
                                                            </span>
                                                        </span>

                                                        {isExpanded ? (
                                                            <ChevronUp
                                                                size={18}
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={18}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="fss-faq-answer">
                                                            <p>{faq.answer}</p>
                                                        </div>
                                                    )}
                                                </article>
                                            );
                                        })
                                    ) : (
                                        <div className="fss-empty-results">
                                            <Search
                                                size={22}
                                                aria-hidden="true"
                                            />
                                            <h3>No matching questions</h3>
                                            <p>
                                                Try a different search term or
                                                choose another category.
                                            </p>
                                            <button
                                                type="button"
                                                className="fss-text-button"
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setActiveCategory("All");
                                                    setExpandedFaq(null);
                                                }}
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Contact information */}
                        <section className="fss-contact-strip">
                            <div className="fss-contact-icon">
                                <Mail size={19} aria-hidden="true" />
                            </div>
                            <div>
                                <h3>Still need help?</h3>
                                <p>
                                    Complete the support request form below
                                    and provide as much relevant detail as
                                    possible.
                                </p>
                            </div>
                            <a
                                href="#fss-support-form"
                                className="fss-contact-link"
                            >
                                Contact support
                                <ExternalLink
                                    size={14}
                                    aria-hidden="true"
                                />
                            </a>
                        </section>

                        {/* Support request form */}
                        <section
                            className="fss-panel"
                            id="fss-support-form"
                        >
                            <div className="fss-panel-heading">
                                <div>
                                    <h2>Submit a Support Request</h2>
                                    <p>
                                        Tell us what you need help with.
                                        Fields marked with * are required.
                                    </p>
                                </div>
                                <span className="fss-heading-icon">
                                    <Send size={19} aria-hidden="true" />
                                </span>
                            </div>

                            <form
                                className="fss-support-form"
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <div className="fss-form-grid">
                                    <div className="fss-form-group">
                                        <label htmlFor="fss-name">
                                            Full Name *
                                        </label>
                                        <input
                                            id="fss-name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            maxLength={100}
                                            required
                                        />
                                    </div>

                                    <div className="fss-form-group">
                                        <label htmlFor="fss-email">
                                            Email Address *
                                        </label>
                                        <input
                                            id="fss-email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            maxLength={254}
                                            required
                                        />
                                    </div>

                                    <div className="fss-form-group fss-full-width">
                                        <label htmlFor="fss-category">
                                            Request Category *
                                        </label>
                                        <select
                                            id="fss-category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {requestCategories.map(
                                                (category) => (
                                                    <option
                                                        value={category}
                                                        key={category}
                                                    >
                                                        {category}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="fss-form-group fss-full-width">
                                        <label htmlFor="fss-subject">
                                            Subject *
                                        </label>
                                        <input
                                            id="fss-subject"
                                            name="subject"
                                            type="text"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Briefly describe your issue"
                                            maxLength={150}
                                            required
                                        />
                                    </div>

                                    <div className="fss-form-group fss-full-width">
                                        <label htmlFor="fss-message">
                                            Message *
                                        </label>
                                        <textarea
                                            id="fss-message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Describe the problem, what happened and any steps you have already tried..."
                                            rows={6}
                                            maxLength={2000}
                                            required
                                        />
                                        <span className="fss-character-count">
                                            {formData.message.length}/2000
                                            characters
                                        </span>
                                    </div>
                                </div>

                                <div className="fss-privacy-note">
                                    <LockKeyhole
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    <p>
                                        Do not include your password, payment
                                        card details or authentication codes
                                        in this message.
                                    </p>
                                </div>

                                <div className="fss-form-actions">
                                    <button
                                        type="button"
                                        className="fss-secondary-button"
                                        onClick={handleClearForm}
                                    >
                                        Clear Form
                                    </button>

                                    <button
                                        type="submit"
                                        className="fss-primary-button"
                                    >
                                        <Send size={15} aria-hidden="true" />
                                        Validate Request
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Support status */}
                        <div className="fss-support-footer">
                            <Clock3 size={15} aria-hidden="true" />
                            <p>
                                Support requests are not submitted until a
                                backend endpoint is connected to this form.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FreelancerSupport;
