import React, { useEffect, useRef, useState } from "react";
import { Button, InputAdornment, Icon, IconButton, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { TextFieldFormsy } from "@fuse";
import Formsy from "formsy-react";
import * as authActions from "app/auth/store/actions";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "app/store/actions";
import { Link } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
  },
  submitButton: {
    height: 54,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 700,
    textTransform: 'none',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
    marginTop: theme.spacing(4),
    '&:hover': {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
      boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
    },
    '&:disabled': {
      background: '#e5e7eb',
      color: '#9ca3af',
    }
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      background: '#f8fafc',
      '& fieldset': {
        borderColor: '#e5e7eb',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563eb',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-outlined': {
      color: '#64748b',
      fontWeight: 500,
    }
  },
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    marginTop: theme.spacing(1),
    color: '#2563eb',
    fontWeight: 600,
    fontSize: '0.875rem',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
}));

function JWTLoginTab() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const login = useSelector(({ auth }) => auth.login);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(() => {
    if (login.error && login.error.message) {
      dispatch(
        Actions.showMessage({
          message: login.error.message === "Invalid credentials."
            ? "Email ou mot de passe incorrect."
            : login.error.message,
          autoHideDuration: 6000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "error",
        })
      );
    }
    setIsFormValid(true);
  }, [dispatch, login.error]);

  function handleSubmit(model) {
    dispatch(authActions.submitLogin(model));
    setIsFormValid(false);
  }

  return (
    <div className="w-full">
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={() => setIsFormValid(true)}
        onInvalid={() => setIsFormValid(false)}
        ref={formRef}
        className={classes.form}
      >
        <TextFieldFormsy
          className={clsx(classes.input, "mb-20")}
          type="email"
          name="email"
          label="Adresse Email"
          validations="isEmail"
          validationErrors={{ isEmail: "L'adresse email n'est pas valide" }}
          variant="outlined"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon className="text-20 text-gray-400">mail</Icon>
              </InputAdornment>
            ),
          }}
        />

        <TextFieldFormsy
          className={classes.input}
          type={values.showPassword ? "text" : "password"}
          name="password"
          label="Mot de passe"
          onChange={handleChange("password")}
          validations={{ minLength: 6 }}
          validationErrors={{ minLength: "La longueur minimale est de 6 caractères" }}
          variant="outlined"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon className="text-20 text-gray-400">lock</Icon>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setValues(v => ({ ...v, showPassword: !v.showPassword }))}
                >
                  {values.showPassword ? <Visibility className="text-20" /> : <VisibilityOff className="text-20" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link className={classes.forgotLink} to="/forgot-password">
          Mot de passe oublié ?
        </Link>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className={classes.submitButton}
          disabled={!isFormValid || login.loading}
        >
          {login.loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter maintenant"}
        </Button>
      </Formsy>
    </div>
  );
}

export default React.memo(JWTLoginTab);
