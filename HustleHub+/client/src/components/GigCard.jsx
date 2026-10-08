import {
    Link
} from "react-router-dom";


function GigCard({ gig }) {

    return (
        <article className="gig-card">

            <Link
                to={`/gigs/${gig._id}`}
                className="gig-image"
            >

                {gig.imageUrl ? (

                    <img
                        src={gig.imageUrl}
                        alt={gig.title}
                    />

                ) : (

                    <div className="image-placeholder">

                        <span>
                            {gig.category}
                        </span>

                    </div>

                )}

            </Link>


            <div className="gig-card-body">

                <div className="seller-row">

                    <div className="small-avatar">
                        {gig.freelancerName
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <span>
                        {gig.freelancerName}
                    </span>

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
                        {gig.rating || "New"}
                    </strong>

                    {gig.reviewCount > 0 && (
                        <span>
                            {" "}
                            ({gig.reviewCount})
                        </span>
                    )}
                </div>


                <div className="gig-card-footer">

                    <span>
                        {gig.deliveryDays} day
                        {gig.deliveryDays !== 1
                            ? "s"
                            : ""}
                    </span>

                    <div>
                        <small>
                            FROM
                        </small>

                        <strong>
                            R{gig.price}
                        </strong>
                    </div>

                </div>

            </div>

        </article>
    );
}


export default GigCard;