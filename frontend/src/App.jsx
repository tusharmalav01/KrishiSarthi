import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Added ProtectedRoute import

import Profile from './pages/Profile';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import BrowseEquipment from './pages/farmer/BrowseEquipment';
import EquipmentDetails from './pages/farmer/EquipmentDetails';
import MyBookings from './pages/farmer/MyBookings';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import MyEquipment from './pages/owner/MyEquipment';
import AddEquipment from './pages/owner/AddEquipment';
import ManageBookings from './pages/owner/ManageBookings';

// Simplified App to test just Login page
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Equipment Details - accessible to authenticated users */}
            <Route
                path="/equipment/:id"
                element={
                    <ProtectedRoute>
                        <EquipmentDetails />
                    </ProtectedRoute>
                }
            />

            {/* Farmer Routes */}
            <Route
                path="/farmer/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                        <FarmerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/farmer/browse"
                element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                        <BrowseEquipment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/farmer/bookings"
                element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                        <MyBookings />
                    </ProtectedRoute>
                }
            />

            {/* Owner Routes */}
            <Route
                path="/owner/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/owner/equipment"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <MyEquipment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/owner/equipment/add"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <AddEquipment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/owner/equipment/edit/:id"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <AddEquipment />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/owner/bookings"
                element={
                    <ProtectedRoute allowedRoles={['owner']}>
                        <ManageBookings />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all for unauthenticated users or unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
