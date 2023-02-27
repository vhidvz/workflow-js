# WorkflowJS

[![npm](https://img.shields.io/npm/v/@vhidvz/wfjs)](https://www.npmjs.com/package/@vhidvz/wfjs)
[![Coverage](https://raw.githubusercontent.com/vhidvz/workflow-js/master/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/workflow-js/blob/master/docs/coverage/lcov-report/index.html)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/vhidvz/workflow-js)
![npm](https://img.shields.io/npm/dm/@vhidvz/wfjs)
![node-current](https://img.shields.io/node/v/@vhidvz/wfjs)
[![GitHub](https://img.shields.io/github/license/vhidvz/workflow-js?style=flat)](https://github.com/vhidvz/workflow-js/blob/master/LICENSE)
[![semantic-release: nodejs](https://img.shields.io/badge/semantic--versioning-nodejs-e10079?logo=semantic-release)](https://semver.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#wfjs:gitter.im)
[![documentation](https://img.shields.io/badge/documentation-click_to_read-c27cf4)](https://vhidvz.github.io/workflow-js/)
[![Build, Test and Publish](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml)

WorkflowJS is a lightweight and flexible library for building workflows and processes with NodeJS. It allows you to define processes using BPMN 2.0.

This is a JavaScript library for building and executing workflows. It provides a simple, declarative syntax for defining processes, and offers a flexible and extensible framework for handling workflow events and activities.

## Installation

```sh
npm install --save @vhidvz/wfjs
```

## Getting Started

### Define a BPMN Schema

To define a BPMN schema, you need to create a file with the extension `.bpmn` and define the schema using the BPMN 2.0 standard or use the online BPMN [editor](https://demo.bpmn.io/new). Here's an example of a simple BPMN schema:

![Simple Workflow](https://raw.githubusercontent.com/vhidvz/workflow-js/master/assets/simple-workflow.svg)

```xml
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <bpmn:collaboration id="Collaboration_0wlp4ym">
    <bpmn:participant id="Participant_0ae9bpa" name="Simple Workflow" processRef="Process_1igpwhg" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1igpwhg" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
      <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="Event_16a7ub0" name="End">
      <bpmn:incoming>Flow_1fznvmj</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:userTask id="Activity_1efomxn" name="Task1">
      <bpmn:incoming>Flow_0hs4ef8</bpmn:incoming>
      <bpmn:outgoing>Flow_17n861s</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:serviceTask id="Activity_0xzkax6" name="Task01">
      <bpmn:incoming>Flow_05tl31k</bpmn:incoming>
      <bpmn:outgoing>Flow_1720nab</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sendTask id="Activity_1r8gmbw" name="Task02">
      <bpmn:incoming>Flow_1720nab</bpmn:incoming>
      <bpmn:outgoing>Flow_1dyucuz</bpmn:outgoing>
    </bpmn:sendTask>
    <bpmn:sequenceFlow id="Flow_0eekk20" sourceRef="StartEvent_1ogvy0x" targetRef="Gateway_009anth" />
    <bpmn:sequenceFlow id="Flow_0hs4ef8" sourceRef="Gateway_009anth" targetRef="Activity_1efomxn" />
    <bpmn:sequenceFlow id="Flow_05tl31k" sourceRef="Gateway_009anth" targetRef="Activity_0xzkax6" />
    <bpmn:sequenceFlow id="Flow_1dyucuz" sourceRef="Activity_1r8gmbw" targetRef="Gateway_00y0ktn" />
    <bpmn:sequenceFlow id="Flow_17n861s" sourceRef="Activity_1efomxn" targetRef="Gateway_00y0ktn" />
    <bpmn:sequenceFlow id="Flow_1fznvmj" sourceRef="Gateway_00y0ktn" targetRef="Event_16a7ub0" />
    <bpmn:sequenceFlow id="Flow_1720nab" sourceRef="Activity_0xzkax6" targetRef="Activity_1r8gmbw" />
    <bpmn:parallelGateway id="Gateway_009anth">
      <bpmn:incoming>Flow_0eekk20</bpmn:incoming>
      <bpmn:outgoing>Flow_0hs4ef8</bpmn:outgoing>
      <bpmn:outgoing>Flow_05tl31k</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:parallelGateway id="Gateway_00y0ktn">
      <bpmn:incoming>Flow_1dyucuz</bpmn:incoming>
      <bpmn:incoming>Flow_17n861s</bpmn:incoming>
      <bpmn:outgoing>Flow_1fznvmj</bpmn:outgoing>
    </bpmn:parallelGateway>
  </bpmn:process>
</bpmn:definitions>
```

> The full definition of the simple workflow schema `.bpmn` file located in [this link](./example/simple-workflow.bpmn).

### Creating a Workflow Instance

To create a new workflow, you need to define a class with methods that represent the different steps of the workflow. You can use decorators to define the nodes and activities of the workflow. Here's an example of a simple workflow:

```ts
import { Act, Node, Process, EventActivity } from '@vhidvz/wfjs';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }
}
```

### Building and Executing the Workflow

Once you have defined the workflow, you can build and execute it using the WorkflowJS library. Here's how you can do it:

```ts
import { parse, readFile, WorkflowJS } from '@vhidvz/wfjs';

const workflow = WorkflowJS.build();

const xml = readFile('./example/simple-workflow.bpmn');

const { context } = workflow.execute({
  factory: () => new SimpleWorkflow(),
  schema: parse(xml)['bpmn:definitions'],
});

console.debug('\nContext is:', JSON.stringify(context.serialize(), null, 2));
```

## [More Example](https://github.com/vhidvz/workflow-js/tree/master/example)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
