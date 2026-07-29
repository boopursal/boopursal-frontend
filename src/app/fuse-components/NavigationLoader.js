import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import navigationConfig, { filterNavigationByUser } from 'app/fuse-configs/navigationConfig';
import { setNavigation } from 'app/store/actions/fuse';
import { useTranslation } from 'react-i18next';

export default function NavigationLoader() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (user) {
      console.log('DEBUG NAVIGATION - User from store:', user);
      console.log('DEBUG NAVIGATION - Role used:', user.role || (user.data && user.data.role));
      
      const filteredNavigation = filterNavigationByUser(navigationConfig, user);
      
      // Deep translation function
      const translateNav = (items) => {
        return items.map(item => {
          const newItem = { ...item };
          // Translate title using a prefix, fallback to original title
          if (newItem.title) {
            newItem.title = t(`nav.${newItem.id}`, newItem.title);
          }
          if (newItem.children) {
            newItem.children = translateNav(newItem.children);
          }
          return newItem;
        });
      };
      
      const translatedNavigation = translateNav(filteredNavigation);
      
      console.log('Navigation filtrée:', translatedNavigation);
      dispatch(setNavigation(translatedNavigation));
    }
  }, [user, dispatch, i18n.language]);

  return null;
}
