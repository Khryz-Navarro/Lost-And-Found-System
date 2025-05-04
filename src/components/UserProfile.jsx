import { useAuth } from "../context/useAuth";
import Usm from "../assets/usm_logo_192x192.png";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        USM LOST AND FOUND ITEMS
      </h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <img src={Usm} alt="USM Logo" className="h-24 w-24" />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                User Profile
              </h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {user?.name || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {user?.email || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Account Type
                  </dt>
                  <dd className="mt-1 text-lg text-gray-900">
                    {user?.isAdmin ? "Administrator" : "Regular User"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-center mt-6">
              <Link
                to="/home"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
