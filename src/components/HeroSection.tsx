import { useState, useEffect } from 'react';
import { Search, ArrowRight, Users, Award, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    providers: 0,
    jobsCompleted: 0,
    regionsCovered: 14
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Count active service providers
      const { count: providersCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Count completed bookings
      const { count: jobsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        providers: providersCount || 0,
        jobsCompleted: jobsCount || 0,
        regionsCovered: 14 // Static for now as it represents coverage areas
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/browse';
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-responsive text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="hero-glass p-8 md:p-12 fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass pl-12 pr-4 py-4 text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="btn-sunset px-8 py-4 text-lg"
                >
                  {t('hero.searchButton')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                className="btn-sunset px-8 py-4 text-lg min-w-[200px]"
                onClick={() => window.location.href = '/browse'}
              >
                {t('hero.findServices')}
              </Button>
              {/* Only show "Offer Skills" button for labourers/providers */}
              {(!profile || profile.user_type === 'labourer' || profile.user_type === 'both') && (
                <Button 
                  className="btn-glass px-8 py-4 text-lg min-w-[200px]"
                  onClick={() => navigate('/create-service')}
                >
                  {t('hero.offerSkills')}
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.providers}</p>
                <p className="text-white/80">{t('hero.skilledWorkers')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.jobsCompleted}</p>
                <p className="text-white/80">{t('hero.jobsCompleted')}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.regionsCovered}</p>
                <p className="text-white/80">{t('hero.regionsCovered')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;