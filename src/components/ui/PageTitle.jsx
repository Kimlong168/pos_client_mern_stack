import { AiOutlinePlusCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// this component is used to show to title of the table and the button to add new record
const PageTitle = ({ title, link }) => {
  return (
    <div
      className={`w-full pb-1 border-b-2 border-orange-500 text-orange-500 flex items-center justify-between gap-3 mb-3 `}
    >
      <small className="text-xl sm:text-2xl md:text-3xl uppercase font-bold">
        {title}
      </small>

      <div>
        <Link to={link}>
          <AiOutlinePlusCircle color="rgb(234,88,12)" size={32} />
        </Link>
      </div>
    </div>
  );
};
PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
export default PageTitle;
