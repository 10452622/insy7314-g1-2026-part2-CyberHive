
import { Link } from "react-router-dom";

function GigCard({ gig }) {
    const freelancerName =
        gig.freelancerName || "Freelancer";

    const freelancerInitial = freelancerName.charAt(0).toUpperCase();

    const formattedPrice =
        Number.isFinite(Number(gig.price)) &&
        gig.price !== null &&
        gig.price !== undefined &&
        gig.price !== ""
            ? Number(gig.price).toLocaleString("en-ZA", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              })
            : null;

    const deliveryDays = Number(gig.deliveryDays); //(IIE, 2026)

    const deliveryLabel =
        gig.deliveryDays !== null &&
        gig.deliveryDays !== undefined &&
        gig.deliveryDays !== "" &&
        Number.isFinite(deliveryDays)
            ? `${deliveryDays} day${deliveryDays === 1 ? "" : "s"}`
            : "Delivery time unavailable";

               {/* (Mozilla, 2025) */}
    return (
        <article className="gig-card">
            <Link
                to={`/gigs/${gig._id}`}
                className="gig-image"
                aria-label={`View ${gig.title}`}
            >
                {gig.imageUrl ? (
                    <img
                        src={gig.imageUrl}
                        alt={gig.title}
                    />
                ) : (
                    <div className="image-placeholder">
                        <span>
                            {gig.category || "Service"}
                        </span>
                    </div>
                )}
            </Link>

            <div className="gig-card-body">
                <div className="seller-row">
                    <div className="small-avatar">
                        {freelancerInitial}
                    </div>

                    <span>{freelancerName}</span>
                </div>

                <Link
                    to={`/gigs/${gig._id}`}
                    className="gig-title"
                >
                    {gig.title}
                </Link>

                <div className="rating">
                    ★{" "}
                    <strong>
                        {gig.rating ?? "New"}
                    </strong>

                    {gig.reviewCount > 0 && (
                        <span>
                            {" "}
                            ({gig.reviewCount} reviews)
                        </span>
                    )}
                </div>

                <div className="gig-card-footer">
                    <span>{deliveryLabel}</span>

                    <div>
                        <small>FROM</small>
                    
                        <strong>
                            {formattedPrice !== null
                                ? `R${formattedPrice}`
                                : "Price unavailable"}
                        </strong>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default GigCard;
/*Reference List

The Independent Institute of Education (IIE), 2026. Information Systems 3D [INSY7314 Module Manual]. The Independent Institute of 
Education: Unpublished.

Mozilla, 2025. JavaScript reference: Standard built-in objects. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference [Accessed: 7 October 2026].
*/