# Setup

> :warning: **Warning: This project is not compatible with Python 3.11 and above!**

## 1. Create a Virtual Environment
To create a virtual environment, navigate to the project directory in your terminal and run the following commands:

### For Unix or MacOS:
```bash
python3 -m venv venv
```

### For Windows:
```bash
py -m venv venv
```
This will create a new virtual environment in a folder named env.

## 2. Activate the Virtual Environment
Before you can start installing or using packages in your virtual environment you’ll need to activate it. 

Activating a virtual environment will put the virtual environment-specific python and pip executables into your shell’s PATH.

### On MacOS and Linux:

```bash
source venv/bin/activate
```
### On Windows:

```bash
.\venv\Scripts\activate
```

## 3. Install Dependencies
Next, install the project dependencies with:

```bash
pip install -r requirements.txt
```
This will install all of the necessary python packages in your virtual environment.

## 4. Updating the requirements.txt file
If you install a new package and want to add it to the requirements.txt file, you can use pip freeze:

```bash
pip freeze > requirements.txt
```
This will update the requirements.txt file with any new dependencies you've installed.

## 5. Running the Flask server
To run the server, execute the following command:

```bash
export FLASK_APP=location_endpoint.py
flask run
```
On Windows, use set instead of export:

```bash
set FLASK_APP=location_endpoint.py
flask run
```
This will start your Flask server!
