![Alt text | 250x250, 50%](/src/assets/logo.png?raw=true "Title")

# Mira
Mira is an organizational tool for AWS' most used services.

*** INSERT GIF HERE ****

## Visualize instances and security groups
Mira accesses AWS's SDK to easily display all of the user's instances in a visually appealing UI. Connections between instances through security groups is clear within Mira and will allow for an easier understanding of your AWS infrasture. 

//Mira utilized graphQL querying to be able to display all instances across all regions to allow an easier big picture view for the user.

//Add something about using electron

## Edit security groups
Editing security groups through AWS is unclear for many users that do not regularly use the AWS dashboard. With the navigatable UI provided by Mira, the user can click on a particular instance to get all data associated with it. In addition to viewing this data, inbound and outbound rules for security groups can be effortlessly changed and these changes will be immediately seen by the user. 


## Setup :
1. Set up a new IAM user on your AWS console: 
Make sure you keep your aws_access_key_id and aws_secret_access_key by downloading the .csv file

2. Give permissions to AWS IAM User

For viewing and editing: give permissions to

		AmazonEC2FullAccess
		AmazonRDSFullAccess

For viewing only : give permissions to 

		AmazonEC2ReadOnlyAccess
		AmazonRDSReadOnlyAccess


3. Set up your configurations:
We recommend installing the AWS CLI within your terminal using:
```bash
npm install -g aws-cli
```
Then use this command within your terminal:
```bash
aws configure
```
Fill in your aws_access_key_id and aws_secret_access_key

Use the default region and default data output(JSON)

## Configure security groups

*** Insert GIF/IMAGE ***


## Contributors

[Emilia Brizuela-Nothaft](https://github.com/emiliacarmel) | [Melody Chai](https://github.com/melodychai) | [Byron Inocencio](https://github.com/jaybyron) |[Jonathan Mavandi](https://github.com/jmavandi)


