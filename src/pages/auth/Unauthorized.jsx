const Unauthorized = () => {
    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h1 style={{ color: 'var(--danger)', fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
                <h2>Access Denied</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    You do not have permission to view this page.
                </p>
                <button
                    className="btn-primary"
                    onClick={() => window.location.href = '/'}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
