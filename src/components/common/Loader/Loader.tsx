import './loader.scss';

interface Props {
    fullPage?: boolean;
    absolute?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Loader = ({ fullPage = false, absolute = false, size = 'md' }: Props) => {
    const spinnerSize = size === 'sm' ? '20px' : size === 'lg' ? '56px' : '36px';

    if (fullPage || absolute) {
        return (
            <div className={fullPage ? "loader-overlay" : "loader-absolute"}>
                <div className="loader-spinner" style={{ width: spinnerSize, height: spinnerSize }} />
            </div>
        );
    }

    return (
        <div className="loader-inline">
            <div className="loader-spinner" style={{ width: spinnerSize, height: spinnerSize }} />
        </div>
    );
};

export default Loader;
