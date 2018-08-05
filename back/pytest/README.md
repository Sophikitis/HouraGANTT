# Tavern - Automated RESTful API testing

### Run HouraGANTT's tests !

* We wrote some use cases in yaml. [Tavern python framework](https://taverntesting.github.io/) allows you to run those test with only on command line ! *

### Setup you environment

1. Dependencies

`sudo apt-get install libcurl4-gnutls-dev librtmp-dev python-pip`

2. Choose virtualenv

```
sudo python -m ensurepip
pip install virtualenv
virtualenv tavern # You can call your env as you wich instead of tavern
source tavern/bin/activate
```

You should see `(tavern)` on your command prompt. For example I get :
`(tavern) vagrant@ubuntu-xenial:/var/www/html/pytest$ `

Whenever you want to leave the virtualenv, just run `deactivate`

3. Install some python packages

```
pip install pyyaml
pip install pycurl
pip install tavern[pytest]
pip install pytest
```

4. Create your test files

In the directory or its children, create a yaml file with this pattern : test_yourfilename.tavern.yaml

Write some use cases as the example bellow :
```
- name: Short description of your request - Here, get list of projects
    request:
      url: http://myEndpoint.com/api/projects
      method: GET
      headers: &default # To store this headers in a variable called *default
          Content-Type: application/x-www-form-urlencoded
          Authorization: "Bearer {access_token}" # The bearer we've stored in access_token before
    response:
      status_code: 200 # The header status code
      body:
        id: 1 # The request response
```

To get more familiar, read the [official documentation](https://taverntesting.github.io/documentation) !

-----

Or, pull the pytest folder from this project and run the test on test_projects.tavern.yaml and test_tasks.tavern.yaml

## Run you tests !

With this command :

`py.test test_projects.tavern.yaml -v`


You should recieve this output :

```
=========================== test session starts ===========================
platform linux2 -- Python 2.7.12, pytest-3.6.4, py-1.5.4, pluggy-0.7.1 -- /var/www/html/pytest/tavern/bin/python
cachedir: .pytest_cache
rootdir: /var/www/html/pytest, inifile:
plugins: tavern-0.16.4
collected 1 item                                                                                                                                                                                                                                                               

test_tasks.tavern.yaml::HouraGANTT Tasks tester PASSED

[100%]

=========================== 1 passed in 2.50 seconds ===========================
```

