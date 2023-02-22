# WorkflowJS

[![npm](https://img.shields.io/npm/v/workflow-js)](https://www.npmjs.com/package/workflow-js)
[![Coverage](https://raw.githubusercontent.com/vhidvz/workflow-js/master/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/workflow-js/blob/master/docs/coverage/lcov-report/index.html)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/vhidvz/workflow-js)
![npm](https://img.shields.io/npm/dm/workflow-js)
![node-current](https://img.shields.io/node/v/workflow-js)
[![GitHub](https://img.shields.io/github/license/vhidvz/workflow-js?style=flat)](https://vhidvz.github.io/workflow-js/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-nodejs-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Gitter](https://badges.gitter.im/workflow-js-npm/community.svg)](https://gitter.im/workflow-js-npm/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![documentation](https://img.shields.io/badge/documentation-click_to_read-c27cf4)](https://vhidvz.github.io/workflow-js/)
[![Build, Test and Publish](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml)

WorkflowJS is a lightweight and flexible library for building workflows and processes with NodeJS. It allows you to define processes using BPMN 2.0.

This is a JavaScript library for building and executing workflows. It provides a simple, declarative syntax for defining processes, and offers a flexible and extensible framework for handling workflow events and activities.

## Installation

```sh
npm install workflow-js
```

## Getting Started

### Define a BPMN Schema

To define a BPMN schema, you need to create a file with the extension `.bpmn` and define the schema using the BPMN 2.0 standard or use the online BPMN [editor](https://demo.bpmn.io/new). Here's an example of a simple BPMN schema:

![Simple Workflow](./assets/simple-workflow.svg)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <bpmn:collaboration id="Collaboration_0wlp4ym">
    <bpmn:participant id="Participant_0ae9bpa" name="Simple Workflow" processRef="Process_1igpwhg" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1igpwhg" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
      <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="Gateway_009anth" name="Decision" default="Flow_0hs4ef8">
      <bpmn:incoming>Flow_0eekk20</bpmn:incoming>
      <bpmn:outgoing>Flow_0hs4ef8</bpmn:outgoing>
      <bpmn:outgoing>Flow_05tl31k</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:exclusiveGateway id="Gateway_00y0ktn" name="Aggregation">
      <bpmn:incoming>Flow_1dyucuz</bpmn:incoming>
      <bpmn:incoming>Flow_17n861s</bpmn:incoming>
      <bpmn:outgoing>Flow_1fznvmj</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    ...
    ...
    ...
    <bpmn:sequenceFlow id="Flow_1dyucuz" sourceRef="Activity_1r8gmbw" targetRef="Gateway_00y0ktn" />
    <bpmn:sequenceFlow id="Flow_17n861s" sourceRef="Activity_1efomxn" targetRef="Gateway_00y0ktn" />
    <bpmn:sequenceFlow id="Flow_1fznvmj" sourceRef="Gateway_00y0ktn" targetRef="Event_16a7ub0" />
    <bpmn:sequenceFlow id="Flow_1720nab" sourceRef="Activity_0xzkax6" targetRef="Activity_1r8gmbw" />
  </bpmn:process>
</bpmn:definitions>
```

> This simple workflow schema `.bpmn` file located in [this link](./assets/simple-workflow.bpmn).

### Creating a Workflow Instance

To create a new workflow, you need to define a class with methods that represent the different steps of the workflow. You can use decorators to define the nodes and activities of the workflow. Here's an example of a simple workflow:

```ts
import { Process, Node, Value, Data, Activity } from 'workflow-js';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  start(@Value() value: string, @Activity() activity: any) {
    console.log(value);

    activity.takeOutgoing();
  }

  @Node({ name: 'End' })
  end( @Data() data: { value: string }, @Activity() activity: any) {
    console.log(data);
  }
}
```

### Building and Executing the Workflow

Once you have defined the workflow, you can build and execute it using the WorkflowJS library. Here's how you can do it:

```ts
import { WorkflowBuilder } from 'workflow-js';

const builder = new WorkflowBuilder();

const workflow = builder.build(SimpleWorkflow);

workflow.execute({ value: 'Hello World!' });
```

## [More Example](./example/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
