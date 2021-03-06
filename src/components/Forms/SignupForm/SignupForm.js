import React, { useState, useRef } from "react";
import "./SignupForm.scss";
import { Box, TextField, Checkbox } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { useForm, Controller } from "react-hook-form";
import Captcha from "../../Captcha";
import Passwords from "../../Passwords";
import { projectId } from "../../../utils/defaultConfigs";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../store/actions/session";
import { FormattedMessage } from "react-intl";
import useHasMounted from "../../../hooks/useHasMounted";

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [gRecaptchaResponse, setCaptchaResponse] = useState("");
  const [ref] = useState("");
  const recaptchaRef = useRef(null);
  const formMethods = useForm();
  const { errors, handleSubmit, register, clearErrors, setError, control } = formMethods;
  const dispatch = useDispatch();
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    // Don't render form statically
    return null;
  }

  /**
   *
   * @typedef {Object} DataObject
   * @property {String} password
   * @property {String} repeatPassword
   * @property {String} firstName
   * @property {String} email
   * @property {Boolean} subscribe
   * @property {Boolean} terms
   */

  /**
   *
   * @param {DataObject} data Data object received byt submitting the form.
   * @returns {void} None.
   */
  const onSubmit = (data) => {
    if (data.password === data.repeatPassword) {
      setLoading(true);
      const payload = {
        projectId: projectId,
        firstName: data.firstName,
        email: data.email,
        password: data.password,
        subscribe: data.subscribe,
        ref: ref,
        array: true,
        gRecaptchaResponse: gRecaptchaResponse,
        terms: data.terms,
      };
      dispatch(registerUser(payload, setLoading));
    } else {
      setError("repeatPassword", { type: "notMatch", message: "Passwords do not match!" });
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Box
        alignItems="center"
        className="signupForm"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <FormattedMessage id="security.name" />
          </label>
          <TextField
            className="customInput"
            error={!!errors.firstName}
            fullWidth
            inputRef={register({ required: true, minLength: 3 })}
            name="firstName"
            type="text"
            variant="outlined"
          />
          {errors.firstName && errors.firstName.type === "required" && (
            <span className="errorText">
              <FormattedMessage id="form.error.firstname" />
            </span>
          )}
          {errors.firstName && errors.firstName.type === "minLength" && (
            <span className="errorText">
              <FormattedMessage id="form.error.firstname.length" />
            </span>
          )}
        </Box>
        <Box
          alignItems="start"
          className="inputBox"
          display="flex"
          flexDirection="column"
          justifyContent="start"
        >
          <label className="customLabel">
            <FormattedMessage id="security.email" />
          </label>
          <TextField
            className="customInput"
            error={!!errors.email}
            fullWidth
            inputRef={register({
              required: true,
              pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
            })}
            name="email"
            type="email"
            variant="outlined"
          />
          {errors.email && errors.email.type === "required" && (
            <span className="errorText">
              <FormattedMessage id="security.email.error.empty" />
            </span>
          )}
          {errors.email && errors.email.type === "pattern" && (
            <span className="errorText">
              <FormattedMessage id="security.email.error.invalid" />
            </span>
          )}
        </Box>

        <Passwords edit={false} formMethods={formMethods} />

        <Box className="inputBox checkbox">
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
            <Checkbox
              className="checkboxInput"
              // error={errors.terms ? "true" : "false"}
              inputRef={register({ required: true })}
              name="terms"
              onChange={() => clearErrors("terms")}
            />
            <Box
              className={"termsBox " + (errors.terms ? " error" : "")}
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="start"
            >
              <FormattedMessage
                id="signup.agreement"
                values={{
                  terms: (
                    <a
                      className="link"
                      href="https://zignaly.com/legal/terms"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FormattedMessage id="signup.terms" />
                    </a>
                  ),
                  privacy: (
                    <a
                      className="link"
                      href="https://zignaly.com/legal/privacy"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FormattedMessage id="signup.privacy" />
                    </a>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box className="inputBox checkbox">
          <Box alignItems="center" display="flex" flexDirection="row" justifyContent="start">
            <Controller
              control={control}
              defaultValue={true}
              name="subscribe"
              render={({ onChange, value }) => (
                <Checkbox
                  checked={value}
                  className="checkboxInput"
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
            <span className="termsText">Subscribe to notifications</span>
          </Box>
        </Box>

        <Box className="captchaBox">
          <Captcha onChange={setCaptchaResponse} recaptchaRef={recaptchaRef} />
        </Box>

        <Box className="inputBox button-box">
          <CustomButton className={"full submitButton"} loading={loading} type="submit">
            <FormattedMessage id="action.signup" />
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default SignupForm;
