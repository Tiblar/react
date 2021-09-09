import React from "react"

import ContentLoader from "../../util/components/ContentLoader";

const PlaceholderPDF = (props) => (
    <ContentLoader
        speed={2}
        width={400}
        height={450}
        viewBox="0 0 400 450"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="5" y="12" rx="3" ry="3" width="350" height="12" />
        <rect x="26" y="34" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="56" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="78" rx="3" ry="3" width="240" height="12" />
        <rect x="5" y="109" rx="3" ry="3" width="350" height="12" />
        <rect x="26" y="131" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="153" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="175" rx="3" ry="3" width="240" height="12" />
        <rect x="5" y="205" rx="3" ry="3" width="350" height="12" />
        <rect x="26" y="227" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="249" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="271" rx="3" ry="3" width="240" height="12" />
        <rect x="5" y="298" rx="3" ry="3" width="350" height="12" />
        <rect x="26" y="320" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="342" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="364" rx="3" ry="3" width="240" height="12" />
        <rect x="5" y="390" rx="3" ry="3" width="350" height="12" />
        <rect x="26" y="412" rx="3" ry="3" width="320" height="12" />
        <rect x="26" y="434" rx="3" ry="3" width="320" height="12" />
    </ContentLoader>
)

export default PlaceholderPDF