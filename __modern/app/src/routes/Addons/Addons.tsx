import classnames from "classnames"
import { useTranslation } from "react-i18next"
import { default as Icon } from "@stremio/stremio-icons/react"

import {
  AddonDetailsModal,
  Button,
  Image,
  Multiselect,
  MainNavBars,
  TextInput,
  SearchBar,
  SharePrompt,
  ModalDialog,
  useBinaryState,
  withCoreSuspender,
} from "stremio/common"

import Addon from "./Addon"
import useInstalledAddons from "./useInstalledAddons"
import useRemoteAddons from "./useRemoteAddons"
import useAddonDetailsTransportUrl from "./useAddonDetailsTransportUrl"
import useSelectableInputs from "./useSelectableInputs"
import styles from "./styles.module.less"
import { useRef, useCallback, useMemo, useState, useLayoutEffect } from "react"

type AddonsProps = {
  urlParams?: {
    path?: string
    transportUrl?: string
    catalogId?: string
    type?: string
  }
  queryParams?: URLSearchParams
}

const Addons = ({ urlParams, queryParams }: AddonsProps) => {
  const { t } = useTranslation()
  const installedAddons = useInstalledAddons(urlParams)
  const remoteAddons = useRemoteAddons(urlParams)
  const [addonDetailsTransportUrl, setAddonDetailsTransportUrl] =
    useAddonDetailsTransportUrl(urlParams, queryParams)
  const selectInputs = useSelectableInputs(installedAddons, remoteAddons)
  const [filtersModalOpen, openFiltersModal, closeFiltersModal] =
    useBinaryState(false)
  const [addAddonModalOpen, openAddAddonModal, closeAddAddonModal] =
    useBinaryState(false)
  const addAddonUrlInputRef = useRef(null)
  const addAddonOnSubmit = useCallback(() => {
    if (addAddonUrlInputRef.current !== null) {
      setAddonDetailsTransportUrl(addAddonUrlInputRef.current.value)
    }
  }, [setAddonDetailsTransportUrl])
  const addAddonModalButtons = useMemo(() => {
    return [
      {
        className: styles["cancel-button"],
        label: t("BUTTON_CANCEL"),
        props: {
          onClick: closeAddAddonModal,
        },
      },
      {
        label: t("ADDON_ADD"),
        props: {
          onClick: addAddonOnSubmit,
        },
      },
    ]
  }, [addAddonOnSubmit])
  const [search, setSearch] = useState("")
  const searchInputOnChange = useCallback((event) => {
    setSearch(event.currentTarget.value)
  }, [])
  const [sharedAddon, setSharedAddon] = useState(null)
  const clearSharedAddon = useCallback(() => {
    setSharedAddon(null)
  }, [])
  const onAddonShare = useCallback((event) => {
    setSharedAddon(event.dataset.addon)
  }, [])
  const onAddonToggle = useCallback(
    (event) => {
      setAddonDetailsTransportUrl(event.dataset.addon.transportUrl)
    },
    [setAddonDetailsTransportUrl],
  )
  const onAddonConfigure = useCallback((event) => {
    window.open(
      event.dataset.addon.transportUrl.replace("manifest.json", "configure"),
    )
  }, [])
  const closeAddonDetails = useCallback(() => {
    setAddonDetailsTransportUrl(null)
  }, [setAddonDetailsTransportUrl])
  const searchFilterPredicate = useCallback(
    (addon) => {
      return (
        search.length === 0 ||
        (typeof addon.manifest.name === "string" &&
          addon.manifest.name.toLowerCase().includes(search.toLowerCase())) ||
        (typeof addon.manifest.description === "string" &&
          addon.manifest.description
            .toLowerCase()
            .includes(search.toLowerCase()))
      )
    },
    [search],
  )
  const renderLogoFallback = useCallback(
    () => <Icon className={styles["icon"]} name="addons" />,
    [],
  )
  useLayoutEffect(() => {
    closeAddAddonModal()
    setSearch("")
    clearSharedAddon()
  }, [urlParams, queryParams])
  return (
    <MainNavBars className={styles["addons-container"]} route="addons">
      <div className={styles["addons-content"]}>
        <div className={styles["selectable-inputs-container"]}>
          {selectInputs.map((selectInput, index) => (
            <Multiselect
              {...selectInput}
              key={index}
              className={styles["select-input-container"]}
            />
          ))}
          <div className={styles["spacing"]} />
          <Button
            className={styles["add-button-container"]}
            title={t("ADD_ADDON")}
            onClick={openAddAddonModal}
          >
            <Icon className={styles["icon"]} name="add" />
            <div className={styles["add-button-label"]}>{t("ADD_ADDON")}</div>
          </Button>
          <SearchBar
            className={styles["search-bar"]}
            title={t("ADDON_SEARCH")}
            value={search}
            onChange={searchInputOnChange}
          />
          <Button
            className={styles["filter-button"]}
            title="All filters"
            onClick={openFiltersModal}
          >
            <Icon className={styles["filter-icon"]} name="filters" />
          </Button>
        </div>
        {installedAddons.selected !== null ? (
          installedAddons.selectable.types.length === 0 ? (
            <div className={styles["message-container"]}>
              No addons ware installed!
            </div>
          ) : installedAddons.catalog.length === 0 ? (
            <div className={styles["message-container"]}>
              No addons ware installed for that type!
            </div>
          ) : (
            <div className={styles["addons-list-container"]}>
              {installedAddons.catalog
                .filter(searchFilterPredicate)
                .map((addon, index) => (
                  <Addon
                    key={index}
                    className={classnames(styles["addon"], "animation-fade-in")}
                    id={addon.manifest.id}
                    name={addon.manifest.name}
                    version={addon.manifest.version}
                    logo={addon.manifest.logo}
                    description={addon.manifest.description}
                    types={addon.manifest.types}
                    behaviorHints={addon.manifest.behaviorHints}
                    installed={addon.installed}
                    onToggle={onAddonToggle}
                    onConfigure={onAddonConfigure}
                    onShare={onAddonShare}
                    dataset={{ addon }}
                  />
                ))}
            </div>
          )
        ) : remoteAddons.selected !== null ? (
          remoteAddons.catalog.content.type === "Err" ? (
            <div className={styles["message-container"]}>
              {remoteAddons.catalog.content.content}
            </div>
          ) : remoteAddons.catalog.content.type === "Loading" ? (
            <div className={styles["message-container"]}>Loading!</div>
          ) : (
            <div className={styles["addons-list-container"]}>
              {remoteAddons.catalog.content.content
                .filter(searchFilterPredicate)
                .map((addon, index) => (
                  <Addon
                    key={index}
                    className={classnames(styles["addon"], "animation-fade-in")}
                    id={addon.manifest.id}
                    name={addon.manifest.name}
                    version={addon.manifest.version}
                    logo={addon.manifest.logo}
                    description={addon.manifest.description}
                    types={addon.manifest.types}
                    behaviorHints={addon.manifest.behaviorHints}
                    installed={addon.installed}
                    onToggle={onAddonToggle}
                    onConfigure={onAddonConfigure}
                    onShare={onAddonShare}
                    dataset={{ addon }}
                  />
                ))}
            </div>
          )
        ) : (
          <div className={styles["message-container"]}>No select</div>
        )}
      </div>
      {filtersModalOpen ? (
        <ModalDialog
          title="Addons filters"
          className={styles["filters-modal"]}
          onCloseRequest={closeFiltersModal}
        >
          {selectInputs.map((selectInput, index) => (
            <Multiselect
              {...selectInput}
              key={index}
              className={styles["select-input-container"]}
            />
          ))}
        </ModalDialog>
      ) : null}
      {addAddonModalOpen ? (
        <ModalDialog
          className={styles["add-addon-modal-container"]}
          title={t("ADD_ADDON")}
          buttons={addAddonModalButtons}
          onCloseRequest={closeAddAddonModal}
        >
          <div className={styles["notice"]}>{t("ADD_ADDON_DESCRIPTION")}</div>
          <TextInput
            ref={addAddonUrlInputRef}
            className={styles["addon-url-input"]}
            type="text"
            placeholder={t("PASTE_ADDON_URL")}
            autoFocus={true}
            onSubmit={addAddonOnSubmit}
          />
        </ModalDialog>
      ) : null}
      {sharedAddon !== null ? (
        <ModalDialog
          className={styles["share-modal-container"]}
          title={t("SHARE_ADDON")}
          onCloseRequest={clearSharedAddon}
        >
          <div className={styles["title-container"]}>
            <Image
              className={styles["logo"]}
              src={sharedAddon.manifest.logo}
              alt={" "}
              renderFallback={renderLogoFallback}
            />
            <div className={styles["name-container"]}>
              <span className={styles["name"]}>
                {typeof sharedAddon.manifest.name === "string" &&
                sharedAddon.manifest.name.length > 0
                  ? sharedAddon.manifest.name
                  : sharedAddon.manifest.id}
              </span>
              {typeof sharedAddon.manifest.version === "string" &&
              sharedAddon.manifest.version.length > 0 ? (
                <span className={styles["version"]}>
                  v. {sharedAddon.manifest.version}
                </span>
              ) : null}
            </div>
          </div>
          <SharePrompt
            className={styles["share-prompt-container"]}
            url={sharedAddon.transportUrl}
          />
        </ModalDialog>
      ) : null}
      {typeof addonDetailsTransportUrl === "string" ? (
        <AddonDetailsModal
          transportUrl={addonDetailsTransportUrl}
          onCloseRequest={closeAddonDetails}
        />
      ) : null}
    </MainNavBars>
  )
}

const AddonsFallback = () => (
  <MainNavBars className={styles["addons-container"]} route="addons" />
)

export default withCoreSuspender(Addons, AddonsFallback)
