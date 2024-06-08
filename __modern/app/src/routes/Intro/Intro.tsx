import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { Fragment, useCallback, useEffect, useReducer, useRef } from "react"
import { Button, Image, useBinaryState } from "stremio/common"
import { useServices } from "stremio/services"
import { Modal, useRouteFocused } from "stremio-router"

import ConsentCheckbox from "./ConsentCheckbox"
import CredentialsTextInput from "./CredentialsTextInput"
import PasswordResetModal from "./PasswordResetModal"
import styles from "./styles.module.less"
import useFacebookToken from "./useFacebookToken"

const SIGNUP_FORM = "signup"
const LOGIN_FORM = "login"

type IntroProps = {
  queryParams?: URLSearchParams
}

const Intro = ({ queryParams }: IntroProps) => {
  const { core } = useServices()
  const routeFocused = useRouteFocused()
  const getFacebookToken = useFacebookToken()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const termsRef = useRef(null)
  const privacyPolicyRef = useRef(null)
  const marketingRef = useRef(null)
  const errorRef = useRef(null)
  const [
    passwordRestModalOpen,
    openPasswordRestModal,
    closePasswordResetModal,
  ] = useBinaryState(false)
  const [loaderModalOpen, openLoaderModal, closeLoaderModal] =
    useBinaryState(false)
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "set-form":
          if (state.form !== action.form) {
            return {
              form: action.form,
              email: "",
              password: "",
              confirmPassword: "",
              termsAccepted: false,
              privacyPolicyAccepted: false,
              marketingAccepted: false,
              error: "",
            }
          }
          return state
        case "change-credentials":
          return {
            ...state,
            error: "",
            [action.name]: action.value,
          }
        case "toggle-checkbox":
          return {
            ...state,
            error: "",
            [action.name]: !state[action.name],
          }
        case "error":
          return {
            ...state,
            error: action.error,
          }
        default:
          return state
      }
    },
    {
      form: [LOGIN_FORM, SIGNUP_FORM].includes(queryParams.get("form"))
        ? queryParams.get("form")
        : SIGNUP_FORM,
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      privacyPolicyAccepted: false,
      marketingAccepted: false,
      error: "",
    },
  )
  const loginWithFacebook = useCallback(() => {
    openLoaderModal()
    getFacebookToken()
      .then((accessToken) => {
        return fetch(
          "https://www.strem.io/fb-login-with-token/" +
            encodeURIComponent(accessToken),
        )
          .then((resp) => resp.json())
          .catch(() => {
            throw new Error("Login failed at getting token from Stremio")
          })
          .then(({ user } = {}) => {
            if (
              !user ||
              typeof user.email !== "string" ||
              typeof user.fbLoginToken !== "string"
            ) {
              throw new Error("Login failed at getting token from Stremio")
            }

            return {
              email: user.email,
              password: user.fbLoginToken,
            }
          })
      })
      .then(({ email, password }) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "Authenticate",
            args: {
              type: "Login",
              email,
              password,
              facebook: true,
            },
          },
        })
      })
      .catch((error) => {
        closeLoaderModal()
        dispatch({ type: "error", error: error.message })
      })
  }, [])
  const loginWithEmail = useCallback(() => {
    if (
      typeof state.email !== "string" ||
      state.email.length === 0 ||
      !emailRef.current.validity.valid
    ) {
      dispatch({ type: "error", error: "Invalid email" })
      return
    }
    if (typeof state.password !== "string" || state.password.length === 0) {
      dispatch({ type: "error", error: "Invalid password" })
      return
    }
    openLoaderModal()
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "Authenticate",
        args: {
          type: "Login",
          email: state.email,
          password: state.password,
        },
      },
    })
  }, [state.email, state.password])
  const loginAsGuest = useCallback(() => {
    if (!state.termsAccepted) {
      dispatch({ type: "error", error: "You must accept the Terms of Service" })
      return
    }
    window.location = "#/"
  }, [state.termsAccepted])
  const signup = useCallback(() => {
    if (
      typeof state.email !== "string" ||
      state.email.length === 0 ||
      !emailRef.current.validity.valid
    ) {
      dispatch({ type: "error", error: "Invalid email" })
      return
    }
    if (typeof state.password !== "string" || state.password.length === 0) {
      dispatch({ type: "error", error: "Invalid password" })
      return
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: "error", error: "Passwords do not match" })
      return
    }
    if (!state.termsAccepted) {
      dispatch({ type: "error", error: "You must accept the Terms of Service" })
      return
    }
    if (!state.privacyPolicyAccepted) {
      dispatch({ type: "error", error: "You must accept the Privacy Policy" })
      return
    }
    openLoaderModal()
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "Authenticate",
        args: {
          type: "Register",
          email: state.email,
          password: state.password,
          gdpr_consent: {
            tos: state.termsAccepted,
            privacy: state.privacyPolicyAccepted,
            marketing: state.marketingAccepted,
            from: "web",
          },
        },
      },
    })
  }, [
    state.email,
    state.password,
    state.confirmPassword,
    state.termsAccepted,
    state.privacyPolicyAccepted,
    state.marketingAccepted,
  ])
  const emailOnChange = useCallback((event) => {
    dispatch({
      type: "change-credentials",
      name: "email",
      value: event.currentTarget.value,
    })
  }, [])
  const emailOnSubmit = useCallback(() => {
    passwordRef.current.focus()
  }, [])
  const passwordOnChange = useCallback((event) => {
    dispatch({
      type: "change-credentials",
      name: "password",
      value: event.currentTarget.value,
    })
  }, [])
  const passwordOnSubmit = useCallback(() => {
    if (state.form === SIGNUP_FORM) {
      confirmPasswordRef.current.focus()
    } else {
      loginWithEmail()
    }
  }, [state.form, loginWithEmail])
  const confirmPasswordOnChange = useCallback((event) => {
    dispatch({
      type: "change-credentials",
      name: "confirmPassword",
      value: event.currentTarget.value,
    })
  }, [])
  const confirmPasswordOnSubmit = useCallback(() => {
    termsRef.current.focus()
  }, [])
  const toggleTermsAccepted = useCallback(() => {
    dispatch({ type: "toggle-checkbox", name: "termsAccepted" })
  }, [])
  const togglePrivacyPolicyAccepted = useCallback(() => {
    dispatch({ type: "toggle-checkbox", name: "privacyPolicyAccepted" })
  }, [])
  const toggleMarketingAccepted = useCallback(() => {
    dispatch({ type: "toggle-checkbox", name: "marketingAccepted" })
  }, [])
  const switchFormOnClick = useCallback(() => {
    const queryParams = new URLSearchParams([
      ["form", state.form === SIGNUP_FORM ? LOGIN_FORM : SIGNUP_FORM],
    ])
    window.location = `#/intro?${queryParams.toString()}`
  }, [state.form])
  useEffect(() => {
    if ([LOGIN_FORM, SIGNUP_FORM].includes(queryParams.get("form"))) {
      dispatch({ type: "set-form", form: queryParams.get("form") })
    }
  }, [queryParams])
  useEffect(() => {
    if (
      routeFocused &&
      typeof state.error === "string" &&
      state.error.length > 0
    ) {
      errorRef.current.scrollIntoView()
    }
  }, [state.error])
  useEffect(() => {
    if (routeFocused) {
      emailRef.current.focus()
    }
  }, [state.form, routeFocused])
  useEffect(() => {
    const onCoreEvent = ({ event, args }) => {
      switch (event) {
        case "UserAuthenticated": {
          closeLoaderModal()
          if (routeFocused) {
            window.location = "#/"
          }
          break
        }
        case "Error": {
          if (args.source.event === "UserAuthenticated") {
            closeLoaderModal()
          }

          break
        }
      }
    }
    core.transport.on("CoreEvent", onCoreEvent)
    return () => {
      core.transport.off("CoreEvent", onCoreEvent)
    }
  }, [routeFocused])
  return (
    <div className={styles["intro-container"]}>
      <div className={styles["background-container"]} />
      <div className={styles["heading-container"]}>
        <div className={styles["logo-container"]}>
          <Image className={styles["logo"]} src="/images/logo.png" alt={" "} />
        </div>
        <div className={styles["title-container"]}>Freedom to Stream</div>
        <div className={styles["slogan-container"]}>
          All the Video Content You Enjoy in One Place
        </div>
      </div>
      <div className={styles["content-container"]}>
        <div className={styles["form-container"]}>
          <CredentialsTextInput
            ref={emailRef}
            className={styles["credentials-text-input"]}
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={emailOnChange}
            onSubmit={emailOnSubmit}
          />
          <CredentialsTextInput
            ref={passwordRef}
            className={styles["credentials-text-input"]}
            type="password"
            placeholder="Password"
            value={state.password}
            onChange={passwordOnChange}
            onSubmit={passwordOnSubmit}
          />
          {state.form === SIGNUP_FORM ? (
            <Fragment>
              <CredentialsTextInput
                ref={confirmPasswordRef}
                className={styles["credentials-text-input"]}
                type="password"
                placeholder="Confirm Password"
                value={state.confirmPassword}
                onChange={confirmPasswordOnChange}
                onSubmit={confirmPasswordOnSubmit}
              />
              <ConsentCheckbox
                ref={termsRef}
                className={styles["consent-checkbox"]}
                label="I have read and agree with the Stremio"
                link="Terms and conditions"
                href="https://www.stremio.com/tos"
                checked={state.termsAccepted}
                onToggle={toggleTermsAccepted}
              />
              <ConsentCheckbox
                ref={privacyPolicyRef}
                className={styles["consent-checkbox"]}
                label="I have read and agree with the Stremio"
                link="Privacy Policy"
                href="https://www.stremio.com/privacy"
                checked={state.privacyPolicyAccepted}
                onToggle={togglePrivacyPolicyAccepted}
              />
              <ConsentCheckbox
                ref={marketingRef}
                className={styles["consent-checkbox"]}
                label="I agree to receive marketing communications from Stremio"
                checked={state.marketingAccepted}
                onToggle={toggleMarketingAccepted}
              />
            </Fragment>
          ) : (
            <div className={styles["forgot-password-link-container"]}>
              <Button
                className={styles["forgot-password-link"]}
                onClick={openPasswordRestModal}
              >
                Forgot password?
              </Button>
            </div>
          )}
          {state.error.length > 0 ? (
            <div ref={errorRef} className={styles["error-message"]}>
              {state.error}
            </div>
          ) : null}
          <Button
            className={classnames(
              styles["form-button"],
              styles["submit-button"],
            )}
            onClick={state.form === SIGNUP_FORM ? signup : loginWithEmail}
          >
            <div className={styles["label"]}>
              {state.form === SIGNUP_FORM ? "Sign up" : "Log in"}
            </div>
          </Button>
        </div>
        <div className={styles["options-container"]}>
          <Button
            className={classnames(
              styles["form-button"],
              styles["facebook-button"],
            )}
            onClick={loginWithFacebook}
          >
            <Icon className={styles["icon"]} name="facebook" />
            <div className={styles["label"]}>Continue with Facebook</div>
          </Button>
          {state.form === SIGNUP_FORM ? (
            <Button
              className={classnames(
                styles["form-button"],
                styles["login-form-button"],
              )}
              onClick={switchFormOnClick}
            >
              <div className={styles["label"]}>LOG IN</div>
            </Button>
          ) : null}
          {state.form === LOGIN_FORM ? (
            <Button
              className={classnames(
                styles["form-button"],
                styles["signup-form-button"],
              )}
              onClick={switchFormOnClick}
            >
              <div className={styles["label"]}>SIGN UP WITH EMAIL</div>
            </Button>
          ) : null}
          {state.form === SIGNUP_FORM ? (
            <Button
              className={classnames(
                styles["form-button"],
                styles["guest-login-button"],
              )}
              onClick={loginAsGuest}
            >
              <div className={styles["label"]}>GUEST LOGIN</div>
            </Button>
          ) : null}
        </div>
      </div>
      {passwordRestModalOpen ? (
        <PasswordResetModal
          email={state.email}
          onCloseRequest={closePasswordResetModal}
        />
      ) : null}
      {loaderModalOpen ? (
        <Modal className={styles["loading-modal-container"]}>
          <div className={styles["loader-container"]}>
            <Icon className={styles["icon"]} name="person" />
            <div className={styles["label"]}>Authenticating...</div>
          </div>
        </Modal>
      ) : null}
    </div>
  )
}

export default Intro
