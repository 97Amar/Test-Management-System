import { Link } from 'react-router-dom';
import './Breadcrumbs.scss';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="breadcrumbs">
      {items.map((item, index) => {
        const isActive = index === items.length - 1; // last item
        return (
          <div
            key={item.label}
           className={`breadcrumb-item`}
          >
            {item.path && !isActive ? (
              <Link to={item.path}>{item.label}</Link>
            ) : (
              <span
              className={`breadcrumb-item ${item.active ? 'active' : ''}`}>{item.label}</span>
            )}

            {/* {index < items.length - 1 && <span className="separator">/</span>} */}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;