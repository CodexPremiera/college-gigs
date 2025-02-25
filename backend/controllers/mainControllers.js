const asyncHandler = require("express-async-handler");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../config/dbConfig");

async function queryDatabase(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, function (error, results) {
      if (error) {
        console.error("Database error:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

const loginEmployer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_employer` where emp_email = ?",
    [email]
  );

  if (result.length == 0) {
    return res.status(404).send("Email not found!");
  }

  const employer = result[0];
  const pass = employer.emp_pass;
  const passwordMatch = await bcrypt.compare(password, pass);

  if (!passwordMatch) {
    return res.status(401).send("Password do not match!");
  }

  let token = jwt.sign({ employer }, process.env.JWT_SECRET, {
    expiresIn: 86400 * 30,
  });

  res.status(200).json({ employer, token });
  return;
});

const loginFreelancer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_flancer` where f_email = ?",
    [email]
  );

  if (result.length == 0) {
    return res.status(404).send("Email not found!");
  }

  const freelancer = result[0];
  const pass = freelancer.f_password;
  const passwordMatch = await bcrypt.compare(password, pass);

  if (!passwordMatch) {
    return res.status(401).send("Password do not match!");
  }

  let token = jwt.sign({ freelancer }, process.env.JWT_SECRET, {
    expiresIn: 86400 * 30,
  });

  return res.status(200).json({ freelancer, token });
});

const registerEmployer = asyncHandler(async (req, res) => {
  let {
    emp_name,
    emp_email,
    emp_pass,
    emp_comp,
    emp_fb,
    emp_insta,
    emp_linkedin,
    emp_page,
    emp_address,
  } = req.body;

  const filepath = req.file.path;

  const result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_employer` where emp_email = ?",
    [emp_email]
  );
  if (result.length > 0)
    return res.status(409).send("email is already registered");

  const salt = bcrypt.genSaltSync(10);
  emp_pass = bcrypt.hashSync(emp_pass, salt);

  const newUser = await queryDatabase(
    "INSERT INTO `c_gigs_s_up_employer` (emp_name, emp_email, emp_pass, emp_comp, emp_fb, emp_insta, emp_linkedin, emp_page, emp_pfp, emp_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      emp_name,
      emp_email,
      emp_pass,
      emp_comp,
      emp_fb,
      emp_insta,
      emp_linkedin,
      emp_page,
      filepath,
      emp_address,
    ]
  );
  console.log(newUser);

  return res.status(200).send("success");
});

const registerFreelancer = asyncHandler(async (req, res) => {
  let {
    f_name,
    f_age,
    f_email,
    f_password,
    f_school,
    f_level,
    f_course,
    f_portfolio,
    f_fb,
    f_insta,
    f_linkedin,
    f_twitter,
  } = req.body;

  const filepath = req.file.path;

  const result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_flancer` where f_email= ?",
    [f_email]
  );

  const salt = bcrypt.genSaltSync(10);
  f_password = bcrypt.hashSync(f_password, salt);

  if (result.length > 0)
    return res.status(409).send("This email already has an account registered");

  const newUser = await queryDatabase(
    "INSERT INTO `c_gigs_s_up_flancer` (f_name, f_age, f_email, f_password, f_school, f_level, f_course, f_portfolio, f_fb, f_insta, f_linkedin, f_twitter, f_pfp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      f_name,
      f_age,
      f_email,
      f_password,
      f_school,
      f_level,
      f_course,
      f_portfolio,
      f_fb,
      f_insta,
      f_linkedin,
      f_twitter,
      filepath,
    ]
  );

  return res.status(200).send("User successfully registered");
});

const updateEmployer = asyncHandler(async (req, res) => {
  let {
    emp_name,
    emp_comp,
    emp_fb,
    emp_insta,
    emp_linkedin,
    emp_page,
    emp_pfp,
    emp_address,
  } = req.body;

  const emp_id = req.tokenData.emp_id;

  const result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_employer` where emp_id = ?",
    [emp_id]
  );

  if (result.length == 0) return res.status(409).send("Employer not found!");

  const query =
    "UPDATE `c_gigs_s_up_employer` SET emp_name = ?, emp_comp = ?, emp_fb = ?, emp_insta = ?, emp_linkedin = ?, emp_page = ?, emp_pfp = ?, emp_address = ? WHERE emp_id = ?";

  const employer = await queryDatabase(query, [
    emp_name,
    emp_comp,
    emp_fb,
    emp_insta,
    emp_linkedin,
    emp_page,
    emp_pfp,
    emp_address,
    emp_id,
  ]);

  return res.status(200).json(employer);
});

const updateFreelancer = asyncHandler(async (req, res) => {
  let {
    f_name,
    f_age,
    f_school,
    f_level,
    f_course,
    f_portfolio,
    f_fb,
    f_insta,
    f_linkedin,
    f_twitter,
    f_pfp,
  } = req.body;

  const f_id = req.tokenData.f_id;

  const result = await queryDatabase(
    "SELECT * FROM `c_gigs_s_up_flancer` where f_id = ?",
    [f_id]
  );

  if (result.length == 0) return res.status(409).send("Freelancer not found!");

  const query =
    "UPDATE `c_gigs_s_up_flancer` SET f_name = ?, f_age = ?, f_school = ?, f_level = ?, f_course = ?, f_portfolio = ?, f_fb = ?, f_insta = ?, f_linkedin = ?, f_twitter = ? WHERE f_id = ?";

  const freelancer = await queryDatabase(query, [
    f_name,
    f_age,
    f_school,
    f_level,
    f_course,
    f_portfolio,
    f_fb,
    f_insta,
    f_linkedin,
    f_twitter,
    f_id,
  ]);

  return res.status(200).json(freelancer);
});

const logout = asyncHandler(async (req, res) => {
  let { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  const query = "INSERT INTO `token_blacklist` (token) VALUES (?)";
  const results = await queryDatabase(query, [token]);

  return res.status(200).send("Loggged out successfully");
});

module.exports = {
  queryDatabase,
  loginEmployer,
  loginFreelancer,
  registerEmployer,
  registerFreelancer,
  updateEmployer,
  updateFreelancer,
  logout,
};
