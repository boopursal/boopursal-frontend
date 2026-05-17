import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
    
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
        let ps = document.querySelector('.st');
        if(ps)
        ps.scrollTop = 0;
    }
  }

  render() {
    return null;
  }
  
}

export default withRouter(ScrollToTop);
