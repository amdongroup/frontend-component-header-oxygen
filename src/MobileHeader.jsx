import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

// Local Components
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import { MenuIcon } from './Icons';

class MobileHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
  }

  renderMainMenu() {
    const { mainMenu } = this.props;

    // Nodes are accepted as a prop
    if (!Array.isArray(mainMenu)) {
      return mainMenu;
    }

    return mainMenu.map((menuItem) => {
      const {
        type,
        href,
        content,
        submenuContent,
      } = menuItem;

      if (type === 'item') {
        return (
          <a key={`${type}-${content}`} className="nav-link" href={href}>
            {content}
          </a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item">
          <MenuTrigger tag="a" role="button" tabIndex="0" className="nav-link">
            {content}
          </MenuTrigger>
          <MenuContent className="position-static pin-left pin-right py-2">
            {submenuContent}
          </MenuContent>
        </Menu>
      );
    });
  }

  renderUserMenuItems() {
    const { userMenu } = this.props;

    return userMenu.map(({ type, href, content }) => (
      <li className="nav-item" key={`${type}-${content}`}>
        <a className="nav-link" href={href}>{content}</a>
      </li>
    ));
  }

  renderLoggedOutItems() {
    const { loggedOutItems } = this.props;

    return loggedOutItems.map(({ type, href, content }, i, arr) => (
      <li className="nav-item px-3 my-2" key={`${type}-${content}`}>
        <a
          className={i < arr.length - 1 ? 'btn btn-block btn-outline-primary' : 'btn btn-block btn-primary'}
          href={href}
        >
          {content}
        </a>
      </li>
    ));
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      loggedIn,
      avatar,
      username,
      stickyOnMobile,
      intl,
      mainMenu,
      userMenu,
      loggedOutItems,
      fullName
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const stickyClassName = stickyOnMobile ? 'sticky-top' : '';
    const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'justify-content-left pl-3' : 'justify-content-center';

    return (
      <header
        aria-label={intl.formatMessage(messages['header.label.main.header'])}
        className={`site-header-mobile d-flex justify-content-between align-items-center shadow ${stickyClassName}`}
      >
        <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
        {mainMenu.length > 0 ? (
          <div className="w-100 d-flex justify-content-start">

            <Menu className="position-static">
              <MenuTrigger
                tag="button"
                className="icon-button"
                aria-label={intl.formatMessage(messages['header.label.main.menu'])}
                title={intl.formatMessage(messages['header.label.main.menu'])}
              >
                <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
              </MenuTrigger>
              <MenuContent
                tag="nav"
                aria-label={intl.formatMessage(messages['header.label.main.nav'])}
                className="nav flex-column pin-left pin-right border-top shadow py-2"
              >
                {this.renderMainMenu()}
              </MenuContent>
            </Menu>
          </div>
        ) : null}
        <div className={`w-100 d-flex ${logoClasses}`}>
          { logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} itemType="http://schema.org/Organization" />}
        </div>
        {userMenu.length > 0 || loggedOutItems.length > 0 ? (
          <div className="w-100 d-flex justify-content-end align-items-center">
            <Menu tag="nav" aria-label={intl.formatMessage(messages['header.label.secondary.nav'])} className="position-static">
              <MenuTrigger
                tag="button"
                className="icon-button"
                aria-label={intl.formatMessage(messages['header.label.account.menu'])}
                title={intl.formatMessage(messages['header.label.account.menu'])}
              >
                {/* <Avatar size="1.5rem" src={avatar} alt={username} /> */}
                <Avatar size="1.5rem" src={avatar} alt={fullName} />
              </MenuTrigger>
              <MenuContent tag="ul" className="nav flex-column pin-left pin-right border-top shadow py-2">
                {loggedIn ? this.renderUserMenuItems() : this.renderLoggedOutItems()}
              </MenuContent>
            </Menu>
          </div>
        ) : null}
      </header>
    );
  }
}

MobileHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),

  userMenu: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  loggedIn: PropTypes.bool,
  stickyOnMobile: PropTypes.bool,

  // i18n
  intl: intlShape.isRequired,
};

MobileHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  loggedOutItems: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  loggedIn: false,
  stickyOnMobile: true,

};

export default injectIntl(MobileHeader);
