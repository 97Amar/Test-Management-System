import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import { useAppSelector } from '../../../hooks/useRedux';
import { BellIcon, ChevronDownIcon, LogoutIcon } from '../../../assets/svgIcons/SvgIcons';
import userImg from '../../../assets/images/user.jpg';
import { ROUTES } from '../../../constants/constants';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="main-header">
            <div className="header-page-info">
                {title && <h1 className="header-title">{title}</h1>}
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
            <div className="header-spacer"></div>

            <div className="header-actions">
                <button className="notification-btn">
                    <BellIcon />
                </button>

                <div className="user-profile-wrapper" ref={dropdownRef}>
                    <div
                        className={`user-profile ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="user-avatar">
                            <img
                                src={userImg}
                                alt="User"
                            />
                        </div>

                        <div className="user-info">
                            <span className="user-name">
                                {user?.name ?? 'User'}
                            </span>

                            <span className="user-role">
                                {user?.role ?? 'Admin'}
                            </span>
                        </div>

                        <ChevronDownIcon className={`chevron-icon ${isDropdownOpen ? 'rotate' : ''}`} />
                    </div>

                    {isDropdownOpen && (
                        <div className="header-dropdown">
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                <LogoutIcon />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;