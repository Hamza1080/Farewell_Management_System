const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path'); // Import the 'path' module

const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "farewell"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Use bodyParser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Home.html'));
});
app.set('view engine', 'ejs');

//<---------------Student Login signup----------------->
app.get('/Student-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Student-Signin.html'));
});

app.get('/Student-Signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Student-Signup.html'));
});

// Handle form submission
app.post('/submit-student-signup', (req, res) => {
    const { studentID, name, email, password, phone_number, dietary_preference } = req.body;
    const sql = 'INSERT INTO student (studentID, name, email, password, phone_number, dietary_preference) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [studentID, name, email, password, phone_number, dietary_preference];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting new student:', err);
            res.status(500).send('An error occurred while processing your request');
            return;
        }
        console.log('New student registered');
        res.redirect('/'); 
    });
});


app.post('/submit-student-login', (req, res) => {
    const { studentID, password } = req.body;

    // Check if student exists in the database
    const query = 'SELECT * FROM student WHERE studentID = ? AND password = ?';
    db.query(query, [studentID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Student exists, redirect to another page
            res.redirect('/StudentHome');
        } else {
            // Student doesn't exist, redirect back to sign-in page
            res.redirect('/Student-Signin');
        }
    });
});
//-----StudentHome------
app.post('/add-menu-itemStu', (req, res) => {
    const { menuItemId, menuStudentId, menuName, menuDescription, menuVotes } = req.body;

    // Perform the insertion operation here using the provided data
    // Example: Insert the new item into the database

    db.query("INSERT INTO menu (itemid, studentid, name, description, votes) VALUES (?, ?, ?, ?, ?)",
        [menuItemId, menuStudentId, menuName, menuDescription, menuVotes],
        (err, result) => {
            if (err) {
                console.error("Error adding menu item:", err);
                res.status(500).send('Error adding menu item');
            } else {
                console.log("Menu item added successfully");
                res.redirect('/StudentHome');
            }
        });
});

app.post('/add-performance-itemStu', (req, res) => {
    const { performanceId, duration, studentId, teamId, type, requirement, votes } = req.body;

    // Perform the insertion operation here using the provided data
    db.query("INSERT INTO performance (performanceid, duration, studentid, teamid, type, requirement, votes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [performanceId, duration, studentId, teamId, type, requirement, votes],
        (err, result) => {
            if (err) {
                console.error("Error adding performance item:", err);
                res.status(500).send('Error adding performance item');
            } else {
                console.log("Performance item added successfully");
                res.redirect('/StudentHome'); // Corrected the redirection path
            }
        });
});


app.get('/StudentHome', (req, res) => {
    // Fetch data from the menu table
    db.query("SELECT * FROM menu ORDER BY votes DESC LIMIT 5", (errMenu, menuResult) => {
        if (errMenu) {
            console.error("Error fetching menu data:", errMenu);
            res.status(500).send('Error fetching data from database');
            return;
        }

        // Fetch data from the performance table
        db.query("SELECT * FROM performance ORDER BY votes DESC LIMIT 5", (errPerformance, performanceResult) => {
            if (errPerformance) {
                console.error("Error fetching performance data:", errPerformance);
                res.status(500).send('Error fetching data from database');
                return;
            }

            // Render HTML template and pass data for both menu and performance
            res.render('StudentHome', { menu: menuResult, performance: performanceResult });
        });
    });
});



app.post('/increment-vote', (req, res) => {
    const itemId = req.body.itemId;

    // Perform the vote incrementation operation here
    // Example: Increment the vote count for the specified item in the 'menu' table

    db.query("UPDATE menu SET votes = votes + 1 WHERE itemid = ?", [itemId], (err, result) => {
        if (err) {
            console.error("Error incrementing vote:", err);
            res.status(500).send('Error incrementing vote');
        } else {
            console.log("Vote incremented successfully");
            res.redirect('/StudentHome'); // Redirect to the homepage or another appropriate page
        }
    });
});


app.post('/increment-vote-Performance', (req, res) => {
    const PerformanceId = req.body.itemId; // Corrected variable name

    // Perform the vote incrementation operation here
    // Example: Increment the vote count for the specified item in the 'performance' table

    db.query("UPDATE performance SET votes = votes + 1 WHERE PerformanceId = ?", [PerformanceId], (err, result) => { // Corrected column name
        if (err) {
            console.error("Error incrementing vote:", err);
            res.status(500).send('Error incrementing vote');
        } else {
            console.log("Vote incremented successfully");
            res.redirect('/StudentHome'); // Redirect to the homepage or another appropriate page
        }
    });
});


//<---------------Student Login signup----------------->

//<---------------Teacher---------------->
app.get('/Teacher-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Teacher-Signin.html'));
});


app.post('/submit-teacher-login', (req, res) => {
    const { teacherID, password } = req.body;

    // Check if teacher exists in the database
    const query = 'SELECT * FROM teacher WHERE teacherID = ? AND password = ?';
    db.query(query, [teacherID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Teacher exists, redirect to another page
            res.redirect('/Teacher-FamilyHome');
        } else {
            // Teacher doesn't exist, redirect back to sign-in page
            res.redirect('/Teacher-Signin');
        }
    });

});

app.get('/Teacher-Signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Teacher-Signup.html'));
});

app.post('/submit-teacher-signup', (req, res) => {
    const { teacherID, name, email, password, phone_number } = req.body;
    const sql = 'INSERT INTO teacher (teacherID, name, email, password, phone_number) VALUES (?, ?, ?, ?, ?)';
    const values = [teacherID, name, email, password, phone_number];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting new teacher:', err);
            res.status(500).send('An error occurred while processing your request');
            return;
        }
        console.log('New teacher registered');
        res.redirect('Teacher-FamilyHome'); // Redirect to the '/' page
    });
});

app.get('/Teacher-FamilyHome', (req, res) => {
    res.sendFile(path.join(__dirname, 'Teacher-FamilyHome.html'));
});

//--add family
app.post('/add-family-member', (req, res) => {
    const { studentID, teacherID, relationship, familyMemberID } = req.body;

    // Insert family member record into the database
    const query = 'INSERT INTO family_members (teacherid, relationship, familymemberid) VALUES ( ?, ?, ?)';
    db.query(query, [ teacherID, relationship, familyMemberID], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Family Member ID Already Exist');
        } else {
            // Family member added successfully
            res.redirect('/Teacher-FamilyHome');
        }
    });
});



//--add family

//<---------------Volunteer Login signup----------------->

app.get('/Volunteer-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Volunteer-Signin.html'));
});

app.post('/Volunteer-login', (req, res) => {
    const { studentID, password } = req.body;

    // Check if student exists in the database
    const query = 'SELECT * FROM student WHERE studentID = ? AND password = ?';
    db.query(query, [studentID, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length > 0) {
            // Student exists, check if the student is registered with a team
            const teamQuery = 'SELECT teamID FROM team_members WHERE studentID = ?';
            db.query(teamQuery, [studentID], (teamErr, teamResult) => {
                if (teamErr) {
                    console.error('Database error:', teamErr);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (teamResult.length > 0) {
                    // Student is registered with a team
                    const teamID = teamResult[0].teamID;
                    // Redirect the student based on the team ID
                    if (teamID === 1) {
                        res.redirect('/MenuTeam');
                    } else if (teamID === 2) {
                        res.redirect('/PerformanceTeam');
                    } else if (teamID === 3) {
                        res.redirect('/InvitationTeam');
                    } else {
                        res.status(400).json({ error: 'Invalid team ID' });
                    }
                } else {
                    // Student is not registered with any team
                    res.status(403).json({ error: 'Student is not registered with any team' });
                }
            });
        } else {
            // Student doesn't exist or incorrect password
            res.status(401).json({ error: 'Invalid student ID or password' });
        }
    });
});
//<---------------------Menu Team------------------->
app.get('/MenuTeam', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('MenuTeam', { menu: result });
        }
    });
});

app.post('/delete-menu-item', (req, res) => {
    const itemId = req.body.itemId;

    // Perform the deletion operation here using the itemId

    // Example: Delete the item from the database
    db.query("DELETE FROM menu WHERE itemid = ?", [itemId], (err, result) => {
        if (err) {
            console.error("Error deleting menu item:", err);
            res.status(500).send('Error deleting menu item');
        } else {
            console.log("Menu item deleted successfully");
            res.redirect('/MenuTeam'); // Redirect to the menu page after deletion
        }
    });
});

app.get('/Viewbudget', (req, res) => {
    db.query("SELECT * FROM budget", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('Viewbudget', { budget: result });
        }
    });
});

app.post('/add-menu-item', (req, res) => {
    const { itemid,studentId, itemName, itemDescription, votes, teamId } = req.body;

    // Perform the insertion operation here using the provided data

    // Example: Insert the new item into the database

    db.query("INSERT INTO menu (itemid,studentid, name, description, votes) VALUES (?, ?, ?, ?, ?)",
        [itemid,studentId, itemName, itemDescription, votes, teamId],
        (err, result) => {
            if (err) {
                console.error("Error adding menu item:", err);
                res.status(500).send('Error adding menu item');
            } else {
                console.log("Menu item added successfully");
                res.redirect('/MenuTeam'); // Redirect to the menu page after addition
            }
        });
});

app.post('/modify-menu-item', (req, res) => {
    const { itemId, studentId, itemName, itemDescription, votes } = req.body;

    // Perform the modification operation here using the provided data

    // Example: Update the menu item in the database
    db.query("UPDATE menu SET studentid = ?, name = ?, description = ?, votes = ? WHERE itemid = ?",
        [studentId, itemName, itemDescription, votes, itemId],
        (err, result) => {
            if (err) {
                console.error("Error modifying menu item:", err);
                res.status(500).send('Error modifying menu item');
            } else {
                console.log("Menu item modified successfully");
                res.redirect('/MenuTeam'); // Redirect to the menu page after modification
            }
        });
});
//<-----------------PerformanceTeam------------------->

app.get('/PerformanceTeam', (req, res) => {
    db.query("SELECT * FROM performance", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('PerformanceTeam', { performance: result });
        }
    });
});

app.post('/delete-performance-item', (req, res) => {
    const performanceId = req.body.performanceId;

    // Perform the deletion operation here using the performanceId
    db.query("DELETE FROM performance WHERE performanceid = ?", [performanceId], (err, result) => {
        if (err) {
            console.error("Error deleting performance item:", err);
            res.status(500).send('Error deleting performance item');
        } else {
            console.log("Performance item deleted successfully");
            res.redirect('PerformanceTeam'); // Redirect to the menu page after deletion
        }
    });
});

app.post('/add-performance-item', (req, res) => {
    const { performanceId, duration, studentId, teamId, type, requirement, votes } = req.body;

    // Perform the insertion operation here using the provided data
    db.query("INSERT INTO performance (performanceid, duration, studentid, teamid, type, requirement, votes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [performanceId, duration, studentId, teamId, type, requirement, votes],
        (err, result) => {
            if (err) {
                console.error("Error adding performance item:", err);
                res.status(500).send('Error adding performance item');
            } else {
                console.log("Performance item added successfully");
                res.redirect('PerformanceTeam'); // Redirect to the menu page after addition
            }
        });
});


app.post('/modify-performance-item', (req, res) => {
    const { performanceId, duration, studentId, teamId, type, requirement, votes } = req.body;

    // Perform the modification operation here using the provided data
    db.query("UPDATE performance SET duration = ?, studentid = ?, teamid = ?, type = ?, requirement = ?, votes = ? WHERE performanceid = ?",
        [duration, studentId, teamId, type, requirement, votes, performanceId],
        (err, result) => {
            if (err) {
                console.error("Error modifying performance item:", err);
                res.status(500).send('Error modifying performance item');
            } else {
                console.log("Performance item modified successfully");
                res.redirect('/PerformanceTeam'); // Redirect to the menu page after modification
            }
        });
});
//-------------InvitationTeam------------
app.get('/InvitationTeam', (req, res) => {
    db.query("SELECT * FROM invitation", (err, result) => {
        if (err) {
            console.error("Error fetching invitations:", err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('InvitationTeam', { invitations: result });
        }
    });
});

//<---------------------Volunteer------------------->
/*
app.post('/submit-team-login', (req, res) => {
    const { teacherID, password } = req.body;

    // Check if teacher exists in the database
    const query = 'SELECT * FROM teacher WHERE teacherID = ? AND password = ?';
    db.query(query, [teacherID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Teacher exists, redirect to another page
            res.redirect('/');
        } else {
            // Teacher doesn't exist, redirect back to sign-in page
            res.redirect('/Teacher-Signin');
        }
    });

});*/

//<---------------Volunteer Login signup----------------->

/*app.post('/submit-teacher-login', (req, res) => {
    const { teacherID, password } = req.body;

    // Check if teacher exists in the database
    const query = 'SELECT * FROM teacher WHERE teacherID = ? AND password = ?';
    db.query(query, [teacherID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Teacher exists, redirect to another page
            res.redirect('/Teacher-FamilyHome');
        } else {
            // Teacher doesn't exist, redirect back to sign-in page
            res.redirect('/Teacher-Signin');
        }
    });

});*/
//<---------------Manager Login----------------->


// Serve Manager Sign-in Page
app.get('/Manager-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Manager-Signin.html'));
});

// Handle Manager Login Form Submission
app.post('/submit-manager-login', (req, res) => {
    const { managerID, password } = req.body;

    // Check if manager exists in the database
    const query = 'SELECT * FROM manager WHERE managerID = ? AND password = ?';
    db.query(query, [managerID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Manager exists, redirect to another page
            res.redirect('/task');
        } else {
            // Manager doesn't exist, redirect back to sign-in page
            res.redirect('/Manager-Signin');
        }
    });
});

//<---------------Organiser Login----------------->
// Serve Organiser Sign-in Page
app.get('/Organiser-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Organiser-Signin.html'));
});

app.get('/Organiser-Home', (req, res) => {
    res.sendFile(path.join(__dirname, 'Organiser-Home.html'));
});


app.post('/add-announcements', (req, res) => {
    const { title, content, organiserID, password, date } = req.body;

    // Check if organiserID exists
    const checkOrganiserQuery = 'SELECT * FROM organiser WHERE organiserID = ?';
    db.query(checkOrganiserQuery, [organiserID], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Error checking organiser:", checkErr);
            res.status(500).send('Error checking organiser');
            return;
        }
        if (checkResult.length === 0) {
            res.status(400).send('Organiser ID does not exist');
            return;
        }

      const announcementQuery = 'INSERT INTO announcement (title, content, organiserID, date) VALUES (?, ?, ?, ?)';
        db.query(announcementQuery, [title, content, organiserID, date], (err, result) => {
            if (err) {
                console.error("Error adding announcement:", err);
                res.status(500).send('Error adding announcement');
            } else {
                // Announcement added successfully, redirect to another page
                res.redirect('/Organiser-Home');
            }
        });
    });
});

app.get('/Organiser-Assigntask', (req, res) => {
    res.sendFile(path.join(__dirname, 'Organiser-AssignTask.html'));
});

app.post('/add-task', (req, res) => {
    const { organiserID, password, taskid, status, teamID, deadline, description } = req.body;

    // Check if organiser exists in the database
    const query = 'SELECT * FROM organiser WHERE organiserID = ? AND password = ?';
    db.query(query, [organiserID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Organiser exists, proceed to add task
            const taskQuery = 'INSERT INTO tasks (taskid, status, teamid, deadline, organiserid, description) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(taskQuery, [taskid, status, teamID, deadline, organiserID, description], (err, result) => {
                if (err) {
                    throw err;
                }
                // Task added successfully, redirect to another page
                res.redirect('/');
            });
        } else {
            // Organiser doesn't exist or incorrect password, redirect back to Organiser Home
            res.redirect('/Organiser-Home');
        }
    });
});



// Handle Organiser Login Form Submission
app.post('/submit-organiser-login', (req, res) => {
    const { organiserID, password } = req.body;

    // Check if organiser exists in the database
    const query = 'SELECT * FROM organiser WHERE organiserID = ? AND password = ?';
    db.query(query, [organiserID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Organiser exists, redirect to another page
            res.redirect('/Organiser-Home');
        } else {
            // Organiser doesn't exist or incorrect password, redirect back to sign-in page
            res.redirect('/Organiser-Signin');
        }
    });
});

//<---------------Administrater Login----------------->
// Serve Organiser Sign-in Page
// Serve System Administrator Sign-in Page
app.get('/SystemAdministrator-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'SystemAdministrator-Signin.html'));
});

// Handle System Administrator Login Form Submission
app.post('/submit-system-administrator-login', (req, res) => {
    const { adminID, password } = req.body;

    // Check if system administrator exists in the database
    const query = 'SELECT * FROM system_administrator WHERE adminID = ? AND password = ?';
    db.query(query, [adminID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // System administrator exists, redirect to another page
            res.redirect('/attendance');
        } else {
            // System administrator doesn't exist or incorrect password, redirect back to sign-in page
            res.redirect('/SystemAdministrator-Signin');
        }
    });
});

//<---------------Budget Manager Login----------------->
// Serve Organiser Sign-in Page

app.get('/BudgetMaster-Signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'BudgetMaster-Signin.html'));
});

app.get('/budget', (req, res) => {
    db.query("SELECT * FROM budget", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('budget', { budget: result });
        }
    });
});

app.post('/submit-budget-master-amountupdate', (req, res) => {
    const { budgetMasterID, amountSpent } = req.body;

    // Update the amount spent in the database
    db.query("UPDATE budget SET amountspent = ? WHERE budgetmasterid = ?", [amountSpent, budgetMasterID], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating amount spent in the database');
        } else {
            console.log('Amount spent updated successfully');
            res.redirect('/budget'); // Redirect to home page or any other page after updating
        }
    });
});


    // Route handler for the home page


// Handle Organiser Login Form Submission
app.post('/submit-budget-master-login', (req, res) => {
    const { budgetMasterID, password } = req.body;

    // Check if budget master exists in the database
    const query = 'SELECT * FROM budget_master WHERE masterID = ? AND password = ?';
    db.query(query, [budgetMasterID, password], (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            // Budget master exists, redirect to another page
            res.redirect('/budget');
        } else {
            // Budget master doesn't exist or incorrect password, redirect back to sign-in page
            res.redirect('/BudgetMaster-Signin');
        }
    });
});

//<---------------Annoucements----------------->

app.get('/announcement', (req, res) => {
    db.query("SELECT title,content,date FROM announcement", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('announcement', { announcements: result });
        }
    });
});

//<---------------View Task----------------->
app.get('/task', (req, res) => {
    db.query("SELECT taskid, status, teamid, deadline, organiserid, description FROM tasks", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('task', { tasks: result });
        }
    });
});

//<---------------Attendance ----------------->
app.get('/attendance', (req, res) => {
    db.query("SELECT * FROM attendance", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching data from database');
        } else {
            // Render HTML template and pass data
            res.render('attendance', { attendance: result });
        }
    });
});

app.post('/add-attendance', (req, res) => {
    const { teacherID, studentID, familyMemberID } = req.body;

    // Insert attendance record into the database
    const query = 'INSERT INTO attendance (teacherid, studentid, familymemberid) VALUES (?, ?, ?)';
    db.query(query, [teacherID, studentID, familyMemberID || null], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error adding attendance record');
        } else {
            // Attendance record added successfully
            res.redirect('/attendance');
        }
    });
});

app.get('/About-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'About-Us.html'));
});

app.get('/Contact-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'Contact.html'));
});


app.get('/Volunteer-Signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Volunteer-Signup.html'));
});

// Assuming you have already established the connection to MySQL

// Route for handling form submission
app.post('/volunteer-signup-submit', (req, res) => {
    const { studentID, password, team } = req.body;

    // Check if student ID already exists in the student table
    db.query('SELECT * FROM student WHERE studentID = ?', [studentID], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            // Student ID already exists
            // Insert into team_members table
            db.query('INSERT INTO team_members (studentID, teamID) VALUES (?, ?)', [studentID, team], (error, results) => {
                if (error) throw error;

                // Redirect or send response
                res.send('Successfully registered and added to team!');
            });
        } else {
            // Student ID does not exist, so register as a new student and insert into team_members table
            db.query('INSERT INTO student (studentID, password) VALUES (?, ?)', [studentID, password], (error, results) => {
                if (error) throw error;

                // Insert into team_members table
                db.query('INSERT INTO team_members (studentID, teamID) VALUES (?, ?)', [studentID, team], (error, results) => {
                    if (error) throw error;

                    // Redirect or send response
                    res.send('Successfully registered and added to team!');
                });
            });
        }
    });
});


//<---------------Ends Here----------------->

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
