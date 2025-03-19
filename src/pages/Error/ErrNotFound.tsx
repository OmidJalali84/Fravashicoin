import { Link } from "react-router-dom";
import styles from "./Error.module.css";

export default function ErrNotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className="title">404 - Page Not Found</h1>
      <p className="not-found-message">
        The page you are looking for does not exist
      </p>
      <Link to="/" className={styles.backToHome}>
        Back to Home
      </Link>
    </div>
  );
}
