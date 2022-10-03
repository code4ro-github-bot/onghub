import React from 'react';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { useProfileQuery } from './services/user/User.queries';
import { Loading } from './components/loading/Loading';
import { UserRole } from './pages/users/enums/UserRole.enum';
import { ORGANIZATION_ERRORS, USER_ERRORS } from './common/constants/error.constants';
import { useErrorToast } from './common/hooks/useToast';
import { useTranslation } from 'react-i18next';

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isRestricted: false,
    restrictedReason: '',
  });
  const [role, setRole] = useState<UserRole | null>(null);
  const { t } = useTranslation('user');

  // Fetch the user after the Cognito call (enabled: false will prevent it from requesting it immediately)
  const { refetch: refetchUserProfile, error: fetchUserError } = useProfileQuery({
    enabled: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const logout: any = async () => {
    await Auth.signOut();
    setAuthState({ isAuthenticated: false, isRestricted: false, restrictedReason: '' });
    setRole(null);
  };

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentAuthenticatedUser();
        const { data: profile, error } = await refetchUserProfile();
        if (!profile) throw error;

        setAuthState({
          ...authState,
          isAuthenticated: true,
        });
        setRole(profile?.role as UserRole);
      } catch (error: any) {
        const err = error?.response?.data;
        switch (err.code) {
          case USER_ERRORS.RESTRICT:
            setAuthState({
              ...authState,
              isRestricted: true,
              restrictedReason: 'account',
            });
            break;
          case ORGANIZATION_ERRORS.RESTRICT:
            setAuthState({
              ...authState,
              isRestricted: true,
              restrictedReason: 'organization',
            });
            break;
          case USER_ERRORS.NOT_FOUND:
            useErrorToast(t('user.not_found'));
            break;
        }
        logout();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (fetchUserError) {
      logout();
    }
  }, [fetchUserError]);

  return (
    <AuthContext.Provider value={{ ...authState, role, setAuthState, logout }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
