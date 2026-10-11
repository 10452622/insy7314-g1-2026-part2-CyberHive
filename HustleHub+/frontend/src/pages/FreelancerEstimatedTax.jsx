import React, { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { fetchFreelancerOrders } from "../services/api";
import FreelancerHeader from "../components/FreelancerHeader";
import "../styles/freelancerEstimatedTax.css";

const money = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function FreelancerEstimatedTax() {
  const [orders, setOrders] = useState([]);
  const [deductions, setDeductions] = useState("0");
  const [taxRate, setTaxRate] = useState("20");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetchFreelancerOrders()
      .then((response) => {
        if (!isCurrent) return;

        setOrders(
          Array.isArray(response.bookings) ? response.bookings : []
        );
      })
      .catch((error) => {
        if (!isCurrent) return;

        setLoadError(
          error?.message || "Your earnings could not be loaded."
        );
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  );

  const yearlyOrders = completedOrders.filter((order) => {
    if (!order.createdAt) return false;

    const orderDate = new Date(order.createdAt);

    return (
      !Number.isNaN(orderDate.getTime()) &&
      orderDate.getFullYear() === currentYear
    );
  });

  const totalIncome = yearlyOrders.reduce(
    (sum, order) => sum + (Number(order.amount) || 0),
    0
  );

  const deductionAmount = Math.min(
    totalIncome,
    Math.max(0, Number(deductions) || 0)
  );

  const taxableIncome = Math.max(0, totalIncome - deductionAmount);

  const effectiveTaxRate = Math.min(
    100,
    Math.max(0, Number(taxRate) || 0)
  );

  const estimatedTax = taxableIncome * (effectiveTaxRate / 100);

  const afterTaxIncome =
    totalIncome - deductionAmount - estimatedTax;

  const stats = [
    {
      label: "Total Income",
      value: money(totalIncome),
      detail: `Completed bookings in ${currentYear}`,
    },
    {
      label: "Estimated Tax",
      value: money(estimatedTax),
      detail: `${effectiveTaxRate}% estimated rate`,
    },
    {
      label: "After-Tax Income",
      value: money(afterTaxIncome),
      detail: "After deductions and estimated tax",
    },
  ];

  return (
    <main className="freelancer-dashboard">
      <FreelancerHeader />

      <div className="freelancer-dashboard-content">
        <section className="freelancer-welcome">
          <p className="freelancer-eyebrow">Financial overview</p>
          <h1>Estimated Tax</h1>
          <p>
            Review your income and estimate how much you may need to set
            aside for tax.
          </p>
        </section>

        {loadError && (
          <p className="freelancer-dashboard-error" role="alert">
            {loadError}
          </p>
        )}

        <section
          className="freelancer-stat-grid fet-stat-grid"
          aria-label="Estimated tax summary"
        >
          {stats.map((stat) => (
            <article className="freelancer-stat" key={stat.label}>
              <span className="freelancer-stat-label">
                {stat.label}
              </span>

              <strong className="freelancer-stat-value">
                {loading ? "—" : stat.value}
              </strong>

              <span className="freelancer-stat-detail">
                {stat.detail}
              </span>
            </article>
          ))}
        </section>

        <section className="freelancer-dashboard-panels fet-panels">
          <article className="freelancer-panel fet-breakdown-panel">
            <div className="freelancer-panel-heading">
              <h2>Tax Breakdown</h2>
            </div>

            {loading ? (
              <p className="freelancer-empty-state">
                Loading your income…
              </p>
            ) : (
              <div className="fet-breakdown">
                <div className="fet-breakdown-row">
                  <span>Total income</span>
                  <strong>{money(totalIncome)}</strong>
                </div>

                <div className="fet-breakdown-row">
                  <span>Deductions</span>
                  <strong>− {money(deductionAmount)}</strong>
                </div>

                <div className="fet-breakdown-row">
                  <span>Taxable income</span>
                  <strong>{money(taxableIncome)}</strong>
                </div>

                <div className="fet-breakdown-row">
                  <span>Estimated tax rate</span>
                  <strong>{effectiveTaxRate}%</strong>
                </div>

                <div className="fet-breakdown-row fet-tax-total">
                  <span>Estimated tax</span>
                  <strong>{money(estimatedTax)}</strong>
                </div>

                <div className="fet-breakdown-row fet-income-total">
                  <span>Income after tax</span>
                  <strong>{money(afterTaxIncome)}</strong>
                </div>
              </div>
            )}
          </article>

          <article className="freelancer-panel fet-calculator-panel">
            <div className="freelancer-panel-heading">
              <h2>
                <Calculator size={19} aria-hidden="true" />
                Adjust Your Estimate
              </h2>
            </div>

            <p className="fet-calculator-description">
              Adjust the values below to see how deductions and your
              estimated rate affect your remaining income.
            </p>

            <div className="fet-form-group">
              <label htmlFor="fet-deductions">
                Estimated deductions (R)
              </label>

              <input
                id="fet-deductions"
                type="number"
                min="0"
                max={totalIncome}
                step="0.01"
                value={deductions}
                onChange={(event) => setDeductions(event.target.value)}
                disabled={loading}
              />

              <small>
                Deductions cannot exceed your total recorded income.
              </small>
            </div>

            <div className="fet-form-group">
              <label htmlFor="fet-tax-rate">
                Estimated tax rate (%)
              </label>

              <input
                id="fet-tax-rate"
                type="number"
                min="0"
                max="100"
                step="1"
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                disabled={loading}
              />

              <small>
                This is an illustrative rate that you can adjust.
              </small>
            </div>

            <div className="fet-calculator-result">
              <span>Estimated amount remaining</span>
              <strong>{loading ? "—" : money(afterTaxIncome)}</strong>
            </div>
          </article>
        </section>

        <aside className="fet-disclaimer">
          <strong>Important note</strong>
          <p>
            This page provides a simplified estimate using completed
            bookings recorded for the current calendar year. It does not
            calculate your official South African tax liability or account
            for all applicable tax brackets, rebates, exemptions, or
            allowable deductions. Consult SARS guidance or a qualified
            tax practitioner for your actual tax obligations.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default FreelancerEstimatedTax;