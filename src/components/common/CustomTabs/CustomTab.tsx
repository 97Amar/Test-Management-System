import './CustomTab.scss';

interface TabItem {
  label: string;
  value: string;
}

interface CustomTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

const CustomTabs = ({
  tabs,
  activeTab,
  onChange,
}: CustomTabsProps) => {
  return (
    <div className="custom-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`custom-tab ${
            activeTab === tab.value ? 'active' : ''
          }`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CustomTabs;