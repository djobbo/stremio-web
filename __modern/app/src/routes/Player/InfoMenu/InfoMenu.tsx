// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"

// import Stream from 'stremio/routes/MetaDetails/StreamsList/Stream'
// import AddonDetails from 'stremio/common/AddonDetailsModal/AddonDetails'
import { MetaPreview, CONSTANTS } from "stremio/common"

import styles from "./styles.module.less"
import { useMemo, useCallback } from "react"

const InfoMenu = ({ className, ...props }) => {
  const metaItem = useMemo(() => {
    return props.metaItem !== null
      ? {
          ...props.metaItem,
          links: props.metaItem.links.filter(
            ({ category }) => category === CONSTANTS.SHARE_LINK_CATEGORY,
          ),
        }
      : null
  }, [props.metaItem])
  const onMouseDown = useCallback((event) => {
    event.nativeEvent.infoMenuClosePrevented = true
  }, [])
  return (
    <div
      className={classnames(className, styles["info-menu-container"])}
      onMouseDown={onMouseDown}
    >
      {metaItem !== null ? (
        <MetaPreview
          className={styles["meta-preview"]}
          compact={true}
          name={metaItem.name}
          logo={metaItem.logo}
          runtime={metaItem.runtime}
          releaseInfo={metaItem.releaseInfo}
          released={metaItem.released}
          description={metaItem.description}
          links={metaItem.links}
        />
      ) : null}
      {/* {
                props.stream !== null ?
                    <Stream
                        {...props.stream}
                        className={classnames(styles['stream'], 'active')}
                        addonName={props.addon !== null ? props.addon.manifest.name : ''}
                    />
                    :
                    null
            } */}
      {/* {
                props.addon !== null ?
                    <AddonDetails
                        id={props.addon.manifest.id}
                        name={props.addon.manifest.name}
                        version={props.addon.manifest.version}
                        logo={props.addon.manifest.logo}
                        description={props.addon.manifest.description}
                        types={props.addon.manifest.types}
                        transportUrl={props.addon.transportUrl}
                    />
                    :
                    null
            } */}
    </div>
  )
}

InfoMenu.propTypes = {
  className: PropTypes.string,
  metaItem: PropTypes.object,
  addon: PropTypes.object,
  stream: PropTypes.object,
}

export default InfoMenu
