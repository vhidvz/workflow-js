# WorkflowJS

[![GitHub](https://img.shields.io/github/license/vhidvz/workflow-js?style=flat)](https://vhidvz.github.io/workflow-js/)
[![Coverage](https://raw.githubusercontent.com/vhidvz/workflow-js/master/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/workflow-js/blob/master/docs/coverage/lcov-report/index.html)
[![Build, Test and Publish to NPM Package Registry](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml)

## Description

WorkflowJS is a lightweight and flexible library for building workflows and processes with NodeJS. It allows you to define processes using BPMN 2.0.

This is a JavaScript library for building and executing workflows. It provides a simple, declarative syntax for defining processes, and offers a flexible and extensible framework for handling workflow events and activities.

## Installation

```sh
npm install workflow-js
```

## Getting Started

### Define BPMN Schema

To define a BPMN schema, you need to create a file with the extension `.bpmn` and define the schema using the BPMN 2.0 standard. Here's an example of a simple BPMN schema:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn"
  exporter="Camunda Modeler"
  exporterVersion="4.8.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
    <bpmn:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:task id="Task_1" />
    <bpmn:sequenceFlow id="SequenceFlow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_1" />
  </bpmn:process>
```

### Creating a Workflow

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

## Documentation

You can find the documentation [here](https://vhidvz.github.io/workflow-js/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [BPMN 2.0](https://www.omg.org/spec/BPMN/2.0/)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Víctor Hernández - [@vhidvz](https://twitter.com/vhidvz)

## Examples

### Simple Workflow

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

### Parallel Gateway

```ts
import { Process, Node, Value, Data, Activity } from 'workflow-js';

@Process({ name: 'Parallel Gateway' })
class ParallelGateway {
  @Node({ name: 'Start' })
  start(@Value() value: string, @Activity() activity: any) {
    console.log(value);

    activity.takeOutgoing();
  }

  @Node({ name: 'Task 1' })
  task1(@Data() data: { value: string }, @Activity() activity: any) {
    data.value = 'Task 1';

    activity.takeOutgoing();
  }

  @Node({ name: 'Task 2' })
  task2(@Data() data: { value: string }, @Activity() activity: any) {
    data.value = 'Task 2';

    activity.takeOutgoing();
  }

  @Node({ name: 'End' })
  end(@Data() data: { value: string }, @Activity() activity: any) {
    console.log(data);
  }
}
```
