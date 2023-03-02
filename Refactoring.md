# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

1. Constants could be moved out of the method in order to allow us to use them maybe in other parts of the file. To avoid premature optimization we can keep them where they are for now. 

2. I prefer early return to else clauses because I feel the code is much more readable. For this I check for event and in case it is undefined, I simply return the TRIVIAL_PARTITION_KEY

3. Always prefer constants over variables because they make the code more readable. For this I refactored introducing the ternary operators. 

4. If this was real code, in order to provide better testing it would make sense to abstract from the crypto library using a service to compute the Hash. For example a Hash class with a hash method that inside uses the crypto library. Adding this abstraction would allow for more readability and make our code more independent from the specific implementations. In this case I simply create a function that hides the complexity and have a more meaningful name - hopefully :) 
Also it avoids repetition. 

5. A SHA3-512 digested as HEX always return a 128 length string. Anyway the last check cannot be removed since at some point maybe we want to change the `MAX_PARTITION_KEY_LENGTH` to be lower and this would break the code. Anyway, if the purpose of the function is returning a lower length string, I would replace the existing code to return a slice and not to recompute it since the result length should be the same. 