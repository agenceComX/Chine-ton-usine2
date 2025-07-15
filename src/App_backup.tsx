import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { QuoteProvider } from './context/QuoteContext';
import { ToastProvider as CustomToastProvider } from './components/ToastNotification';
import './styles/notifications.css';
import RoleBasedRoute from './components/RoleBasedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import DebugPanel from './components/DebugPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import AuthDebug from './components/AuthDebug';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import DashboardOrdersPage from './pages/dashboard/DashboardOrdersPage';
import DashboardProductsPage from './pages/dashboard/DashboardProductsPage';
import DashboardSuppliersPage from './pages/dashboard/DashboardSuppliersPage';
import DashboardStatsPage from './pages/dashboard/DashboardStatsPage';
import DashboardSettingsPage from './pages/dashboard/DashboardSettingsPage';

// Lazy loading des composants pour réduire la taille du bundle initial
const HomePage = React.lazy(() => import('./pages/HomePageFixed'));
const ProductsPageB2B = React.lazy(() => import('./pages/ProductsPageB2B'));
const ProductDetailPageB2B = React.lazy(() => import('./pages/ProductDetailPageB2B'));
const ProductsList = React.lazy(() => import('./components/ProductsList'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const SupplierProfilePage = React.lazy(() => import('./pages/SupplierProfilePage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const AuthPageCombined = React.lazy(() => import('./pages/AuthPageCombined'));
const UniversalLoginPage = React.lazy(() => import('./pages/UniversalLoginPage'));
const UniversalRegisterPage = React.lazy(() => import('./pages/UniversalRegisterPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Pages Supplier (lazy loaded)
const SupplierDashboardPage = React.lazy(() => import('./pages/supplier/DashboardPage'));
const SupplierProductsPage = React.lazy(() => import('./pages/supplier/ProductsPage'));
const SupplierProductsPageNew = React.lazy(() => import('./pages/supplier/ProductsPageNew'));
const SupplierCustomersPage = React.lazy(() => import('./pages/supplier/CustomersPage'));
const SupplierMessagesPage = React.lazy(() => import('./pages/supplier/MessagesPage'));
const SupplierDocumentsPage = React.lazy(() => import('./pages/supplier/DocumentsPage'));
const SupplierReviewsPage = React.lazy(() => import('./pages/supplier/ReviewsPage'));
const SupplierAnalyticsPage = React.lazy(() => import('./pages/supplier/AnalyticsPage'));
const SupplierSettingsPage = React.lazy(() => import('./pages/supplier/SettingsPage'));

// Pages Admin (lazy loaded)
const AdminDashboardPage = React.lazy(() => import('./pages/admin/DashboardPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/UsersPage'));
const AdminSuppliersPage = React.lazy(() => import('./pages/admin/SuppliersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/admin/OrdersPage'));
const AdminReportsPage = React.lazy(() => import('./pages/admin/ReportsPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));
const AdminModerationPage = React.lazy(() => import('./pages/admin/ModerationPage'));
const AdminDocumentsPage = React.lazy(() => import('./pages/admin/DocumentsPage'));
const AdminContainersPage = React.lazy(() => import('./pages/admin/ContainersManagementPage'));

// Pages Influenceur (lazy loaded)
const InfluencerDashboard = React.lazy(() => import('./pages/influencer/InfluencerDashboard'));

// Pages supplémentaires
const ContainersPage = React.lazy(() => import('./pages/ContainersPage'));

function LoginRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" message="Vérification de la session..." />
            </div>
        );
    }

    if (user) {
        const roleRedirects = {
            admin: '/admin/dashboard',
            supplier: '/supplier/dashboard',
            customer: '/dashboard',
            sourcer: '/sourcer/dashboard',
            influencer: '/sourcer/dashboard'
        };

        return <Navigate to={roleRedirects[user.role]} replace />;
    }

    return <>{children}</>;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPageB2B />} />
            <Route path="/products-test" element={<ProductsList />} />
            <Route path="/product/:id" element={<ProductDetailPageB2B />} />
            <Route path="/product-detail/:id" element={<ProductDetailPage />} />
            <Route path="/supplier/:supplierId" element={<SupplierProfilePage />} />
            <Route path="/product-old/:id" element={<ProductPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            <Route path="/login" element={<LoginRoute><UniversalLoginPage /></LoginRoute>} />
            <Route path="/register" element={<LoginRoute><UniversalRegisterPage /></LoginRoute>} />

            {/* Redirection pour /auth vers /login pour éviter la confusion */}
            <Route path="/auth" element={<Navigate to="/login" replace />} />

            {/* Routes d'ancienne version pour comparaison */}
            <Route path="/login-combined" element={<LoginRoute><AuthPageCombined /></LoginRoute>} />
            <Route path="/register-combined" element={<LoginRoute><AuthPageCombined /></LoginRoute>} />
            <Route path="/login-old" element={<LoginRoute><LoginPage /></LoginRoute>} />
            <Route path="/register-old" element={<LoginRoute><RegisterPage /></LoginRoute>} />

            <Route
                path="/containers"
                element={
                    <RoleBasedRoute allowedRoles={['supplier']}>
                        <ContainersPage />
                    </RoleBasedRoute>
                }
            />

            {/* Dashboard principal pour les clients */}
            <Route
                path="/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardHomePage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/dashboard/orders"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardOrdersPage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/dashboard/products"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardProductsPage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/dashboard/suppliers"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardSuppliersPage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/dashboard/stats"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardStatsPage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/dashboard/settings"
                element={
                    <RoleBasedRoute allowedRoles={['customer', 'admin']}>
                        <DashboardLayout>
                            <DashboardSettingsPage />
                        </DashboardLayout>
                    </RoleBasedRoute>
                }
            />

            {/* Routes Supplier */}
            <Route
                path="/supplier/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierDashboardPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/products"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierProductsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/products-new"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierProductsPageNew />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/customers"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierCustomersPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/messages"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierMessagesPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/documents"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierDocumentsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/reviews"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierReviewsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/analytics"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierAnalyticsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/supplier/settings"
                element={
                    <RoleBasedRoute allowedRoles={['supplier', 'admin']}>
                        <SupplierSettingsPage />
                    </RoleBasedRoute>
                }
            />

            {/* Route Dashboard Influenceur - remplace le dashboard sourceur */}
            <Route
                path="/sourcer/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['sourcer', 'influencer', 'admin']}>
                        <InfluencerDashboard />
                    </RoleBasedRoute>
                }
            />

            {/* Routes Admin */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminUsersPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/suppliers"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminSuppliersPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/orders"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminOrdersPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/reports"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminReportsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/settings"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminSettingsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/moderation"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminModerationPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/documents"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminDocumentsPage />
                    </RoleBasedRoute>
                }
            />

            <Route
                path="/admin/containers"
                element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                        <AdminContainersPage />
                    </RoleBasedRoute>
                }
            />

            {/* Pages pour le debug et test */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/auth-debug" element={<AuthDebug />} />

            {/* Page 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <LanguageProvider>
                    <CurrencyProvider>
                        <ThemeProvider>
                            <ToastProvider>
                                <NotificationProvider>
                                    <FavoritesProvider>
                                        <QuoteProvider>
                                            <CustomToastProvider>
                                                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                                                    <Navbar />
                                                    <Suspense fallback={
                                                        <div className="min-h-screen flex items-center justify-center bg-gray-50">
                                                            <LoadingSpinner size="lg" message="Chargement..." />
                                                        </div>
                                                    }>
                                                        <AppRoutes />
                                                    </Suspense>
                                                    <Footer />
                                                    <DebugPanel />
                                                </div>
                                            </CustomToastProvider>
                                        </QuoteProvider>
                                    </FavoritesProvider>
                                </NotificationProvider>
                            </ToastProvider>
                        </ThemeProvider>
                    </CurrencyProvider>
                </LanguageProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
