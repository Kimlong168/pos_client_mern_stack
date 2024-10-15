import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";

import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";
import { notify } from "../../utils/toastify";
import { handleDeleteFunction } from "../../utils/handleDeleteFunction";

import { useDeleteUser, useUsers } from "../../hooks/user/useUser";
import { UserContext } from "../../contexts/UserContext";
import SelectFilter from "../../components/form/SelectFilter";

const User = () => {
  const { data, isLoading, isError } = useUsers();
  const delelteUser = useDeleteUser();

  const {
    state: users,
    dispatch,
    removeUser,
    searchUser,
  } = useContext(UserContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByRole = (role) => {
    if (role === "all") {
      dispatch({ type: "SET_USER", payload: data });
    } else {
      const filteredData = data.filter((item) => item.role === role);
      dispatch({ type: "SET_USER", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_USER", payload: data });
    } else {
      searchUser(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await delelteUser.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeUser(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* page title */}
      <PageTitle title={`Users (${users?.length || 0})`} link="/createUser" />

      {/* search and filter */}
      <div className="flex flex-col  items-center mb-5">
        <div className="flex flex-col md:flex-row items-center gap-5 py-5 w-full">
          <SelectNumberPerPage
            setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
            numberOfRecordsPerPage={numberOfRecordsPerPage}
            maxLength={users?.length}
          />

          <SearchBar
            handleSearch={handleSearch}
            setSearchKeyWord={setSearchKeyWord}
            searchKeyWord={searchKeyWord}
          />
        </div>
        <div className="flex flex-row gap-3 items-center w-full">
          <div>
            <label>
              <span className="text-gray-700">Role</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByRole}
              filterName={"role"}
              options={[
                { value: "all", label: "All" },
                { value: "admin", label: "Admin" },
                { value: "manager", label: "Manager" },
                { value: "inventoryStaff", label: "Inventory Staff" },
                { value: "cashier", label: "Cashier" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Profile Picture",
            "Name",
            "Email",
            "Role",
            "Chat ID",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={7} />
          ) : (
            <>
              {users?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={7}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={users}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={7}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default User;
