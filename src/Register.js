import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faXmark,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./axios/axios";
import "./styles/register.css";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pass, setPass] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const [matchPass, setMatchPass] = useState("");
  const [validMatchPass, setValidMatchPass] = useState(false);
  const [matchPassFocus, setMatchPassFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PASS_REGEX.test(pass);
    console.log(result);
    console.log(pass);
    setValidPass(result);
    const match = pass === matchPass;
    setValidMatchPass(match);
  }, [pass, matchPass]);

  useEffect(() => {
    setErrMsg("");
  }, [pass, matchPass, user]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PASS_REGEX.test(pass);
    if (!v1 || !v2) {
      setErrMsg("Invalid input");
      return;
    }

    try {
      const res = await axios.post("/add", {
        firstName: user,
        lastName: pass, // the api does not have a password field so using this instead.
      });

      console.log(res.data);
      setSuccess(true);
    } catch (err) {
      if (!err?.res) {
        setErrMsg("No Server Response");
      } else if (err.res?.status === 409) {
        setErrMsg("Username Already Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      // errRef.current.focus();
      console.log(err);
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#"> Sign In </a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSumbit}>
            <label htmlFor="username">
              Username:{" "}
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} style={{ color: "#1a6100" }} />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faXmark} style={{ color: "#940000" }} />
              </span>{" "}
            </label>

            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              {"  "}4 to 24 characters. <br />
              Must begin with a letter. <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <label htmlFor="password">
              Password:{" "}
              <span className={validPass ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} style={{ color: "#1a6100" }} />
              </span>
              <span className={validPass || !pass ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faXmark} style={{ color: "#940000" }} />
              </span>
            </label>

            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPass(e.target.value)}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              aria-invalid={validPass ? "false" : "true"}
              aria-describedby="passnote"
            />
            <p
              id="passnote"
              className={passFocus && !validPass ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              {"  "}8 to 24 characters long. <br />
              Must contain lowercase and uppercase letters, a number, and a
              special character. <br />
              Special characters allowed :
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirmPass">
              Confirm Password:{" "}
              <span className={validMatchPass && validPass ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} style={{ color: "#1a6100" }} />
              </span>
              <span
                className={validMatchPass || !matchPass ? "hide" : "invalid"}
              >
                <FontAwesomeIcon icon={faXmark} style={{ color: "#940000" }} />
              </span>
            </label>

            <input
              type="password"
              id="confirmPass"
              required
              onChange={(e) => setMatchPass(e.target.value)}
              onFocus={() => setMatchPassFocus(true)}
              onBlur={() => setMatchPassFocus(false)}
              aria-invalid={validMatchPass ? "false" : "true"}
              aria-describedby="matchpassnote"
            />
            <p
              id="matchpassnote"
              className={
                matchPassFocus && !validMatchPass ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              {"  "}Password and Confirm Password must be the same.
            </p>

            <button
              disabled={
                !validName || !validPass || !validMatchPass ? true : false
              }
            >
              Sign Up
            </button>
          </form>
        </section>
      )}
    </>
  );
}
