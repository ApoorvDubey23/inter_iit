import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import { useState, useContext } from "react";
import { ModeContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Assuming you have a ModeContext for comparison toggle

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [user1, setUser1] = useState("");
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const { isComparing, setIsComparing } = useContext(ModeContext);

  const toggleComparison = () => {
    setIsComparing(!isComparing);
    console.log(isComparing);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setUser1(user);
    }
  });

  const Logout = async () => {
    window.sessionStorage.removeItem("user");
    navigate("/login");
  };


  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex text-2xl font-semibold flex-shrink-0 items-center">
              CoinTrace
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Replace navigation items with the Compare button */}
                <button
                  onClick={toggleComparison}
                  className={`${
                    isComparing ? "bg-purple-900" : "bg-purple-600"
                  } hover:bg-purple-700 text-white rounded-md px-3 py-2 text-sm font-medium`}
                >
                  {isComparing ? "Disable Compare" : "Enable Compare"}
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={user1.picture}
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hover:bg-purple-800 bg-purple-600" 
              >
                
                <MenuItem>
                  <button
                    onClick={Logout}
                    className="block w-full px-4 py-2 text-sm text-white hover:bg-purple-800 bg-purple-600"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* Replace navigation items with Compare button in mobile */}
          <DisclosureButton
            as="button"
            onClick={toggleComparison}
            className={`w-full text-center block rounded-md px-3 py-2 text-base font-medium ${
              isComparing
                ? "bg-purple-900 text-white"
                : "bg-purple-600 text-white"
            } hover:bg-purple-700`}
          >
            {isComparing ? "Disable Compare Mode" : "Enable Compare Mode"}
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
