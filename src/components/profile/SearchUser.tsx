import { useNavigate } from "react-router-dom";
import Path from "../../routes/path";

export default function SearchUser() {
  const navigate = useNavigate();

  const searchForm = (e: any) => {
    e.preventDefault();
    navigate(Path.PROFILE + "/" + e.target.userName.value);
  };

  return (
    <div className={"bg-base-100 w-full flex flex-col items-center"}>
      <div
        className={
          "bg-base-100 md:px-20 py-2 rounded-lg flex flex-col items-center"
        }
      >
        <span className={"font-bold text-2xl my-2 mb-2"}>User Search</span>
        <span className={"max-sm:max-w-[300px] text-center"}>
          For informing of the all account details search desired username
        </span>
        <form className={"join p-4 rounded-full"} onSubmit={searchForm}>
          <input
            className="input input-bordered join-item max-w-[250px]" // some buggy shit with input width
            type="text"
            id={"userName"}
            placeholder="Username"
          />
          <button
            className="btn btn-primary join-item rounded-r-full"
            type={"submit"}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
