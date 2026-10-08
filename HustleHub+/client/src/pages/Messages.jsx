import {
    Link
} from "react-router-dom";

import ClientNavbar from "../components/ClientNavbar";


function Messages() {

    return (
        <>
           <ClientNavbar />

            <main className="messages-page">

                <section className="messages-card">

                    <div className="messages-icon">
                        💬
                    </div>


                    <span className="page-eyebrow">
                        HUSTLEHUB+ MESSAGES
                    </span>


                    <h1>
                        Messages
                    </h1>


                    <p>
                        Your conversations with
                        freelancers will appear
                        here when messaging becomes
                        available.
                    </p>


                    <div className="messages-info">

                        <div>
                            <strong>
                                No conversations yet
                            </strong>

                            <span>
                                Book a service and
                                connect with talented
                                freelancers on
                                HustleHub+.
                            </span>
                        </div>

                    </div>


                    <Link
                        to="/gigs"
                        className="primary-button"
                    >
                        Browse Gigs
                    </Link>

                </section>

            </main>
        </>
    );
}


export default Messages;