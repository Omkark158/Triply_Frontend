import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/shared/ui/Tabs';
import { ArrowLeft } from 'lucide-react';
import TripDetail from '../components/trips/TripDetail';
import ItineraryBuilder from '../components/itinerary/ItineraryBuilder';
import BudgetDashboard from '../components/budget/BudgetDashboard';
import MapView from '../components/maps/MapView';
import DocumentManager from '../components/documents/DocumentManager';
import ShareTrip from '../components/collaboration/ShareTrip';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const TripPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition m-4"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="px-4 py-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="collaborate">Share</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <TripDetail tripId={tripId} />
            </TabsContent>

            <TabsContent value="itinerary">
              <ItineraryBuilder tripId={tripId} />
            </TabsContent>

            <TabsContent value="budget">
              <ErrorBoundary>
                <BudgetDashboard tripId={tripId} />
              </ErrorBoundary>
            </TabsContent>

            <TabsContent value="map">
              <MapView tripId={tripId} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentManager tripId={tripId} />
            </TabsContent>

            <TabsContent value="collaborate">
              <ShareTrip tripId={tripId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};